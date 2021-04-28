import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {KonvaComponent} from 'ng2-konva';
import {CanvasProperties} from './model/canvas-properties';
import {Dimension} from './model/dimension';
import {WebsocketService} from '../shared/websockets/websocket.service';
import {Data} from '../shared/websockets/model/data';

declare const Konva: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('stage') stage: KonvaComponent;
  @ViewChild('layer') layer: KonvaComponent;
  @ViewChild('canvasContainer') canvasContainer: ElementRef;
  @ViewChild('canvasContainerView') canvasContainerView: ElementRef;
  @ViewChild('canvasImageView') canvasImageView: ElementRef;
  @Input() isDrawer: boolean;
  public configStage: Observable<any>;
  private canvasProperties: CanvasProperties;
  private readonly canvasSize: Dimension = {width: (1000), height: (500)};

  constructor(private socketsService: WebsocketService) {
    this.canvasProperties = new CanvasProperties();
    this.isFill = false;
    this.socketsService.subject.subscribe(this.handleResponse);
  }

  private _threeDMode: boolean;
  private isFill: boolean;

  set threeDMode(value: boolean) {
    this._threeDMode = value;
  }

  private static isMobile(width: number): boolean {
    return width <= 300;
  }

  handleResponse = (response: Data): void => {

    if (response.type === 'canvasUpdate') {
      if (!this.isDrawer) {
        this.canvasImageView.nativeElement.setAttribute('src', response.data.canvas);
      }
    }
    if (response.type === 'canvasUpdateBackground') {
      if (!this.isDrawer) {
        const parentContainer = this.canvasContainerView.nativeElement;
        parentContainer.style.backgroundColor = response.data.backgroundColor;
      }
    }
    if (response.type === 'drawerId') {
      this.deleteCanvas(this.stage, this.canvasContainer);
    }
  };

  ngOnInit(): void {
    this.configStage = of({
      container: 'canvas-container',
      width: this.canvasSize.width,
      height: this.canvasSize.height
    });
  }

  ngAfterViewInit(): void {
    if (this.canvasContainer) {
      const parentContainer = this.canvasContainer.nativeElement;
      parentContainer.style.backgroundColor = this.canvasProperties.backgroundColor;
      this.paint();
      this.fitCanvasIntoParentContainer(this.stage);
    }
    if (this.canvasContainerView) {
      const parentContainerView = this.canvasContainerView.nativeElement;
      parentContainerView.style.backgroundColor = this.canvasProperties.backgroundColor;
    }

  }

  @HostListener('window:resize', ['$event.target'])
  resize(): void {
    if (this.canvasContainer) {
      this.fitCanvasIntoParentContainer(this.stage);
    }
  }

  public paint(): void {
    let isPaint = false;
    let lastLine;
    const circle = new Konva.Circle({
      stroke: 'grey',
      strokeWidth: this.canvasProperties.brushWidth,
      visible: false,
      listening: false
    });
    this.layer.getStage().add(circle);
    this.stage.getStage().on('mousedown touchstart', (e) => {
      window.document.body.style.overflow = 'hidden';
      isPaint = true;
      const pos = this.stage.getStage().getPointerPosition();
      lastLine = new Konva.Line({
        stroke: this.canvasProperties.actualColor,
        strokeWidth: this.canvasProperties.brushWidth,
        lineCap: 'round',
        lineJoin: 'round',
        shadowColor: '#080808',
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        shadowEnabled: !!this._threeDMode,
        globalCompositeOperation:
          this.canvasProperties.mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
        name: 'line',
        perfectDrawEnabled: false,
        transformsEnabled: 'position'
      });
      lastLine.on('mousedown touchstart', (line) => {
        if (this.isFill) {
          this.fillLine(line.target, this.canvasProperties.actualColor);
        }
      });
      this.layer.getStage().add(lastLine);
      this.layer.getStage().batchDraw();
    });

    this.stage.getStage().on('mousedown touchstart', async (line) => {
      if (this.isFill) {
        const roomId = localStorage.getItem('roomId');
        if (line.target.attrs.container && line.target.attrs.container.id === 'canvas-container') {
          this.canvasProperties.backgroundColor = this.canvasProperties.actualColor;
          const parentContainer = this.canvasContainer.nativeElement;
          parentContainer.style.backgroundColor = this.canvasProperties.backgroundColor;

          const data = {
            backgroundColor: this.canvasProperties.backgroundColor, roomId
          };
          this.socketsService.sendMessage(data, 'canvasBackground');
        }
        await this.sendCanvas();
      }
    });


    this.stage.getStage().on('mouseup touchend', async (e) => {
      isPaint = false;
      circle.visible(false);
      window.document.body.style.overflow = 'visible';
      await this.sendCanvas();
    });

    this.stage.getStage().on('mousemove touchmove', async (e) => {
      if (!isPaint || this.isFill) {
        return;
      }
      const position = this.stage.getStage().getPointerPosition();
      if (this.canvasProperties.mode !== 'brush') {
        circle.visible(true);
        circle.setX(position.x);
        circle.setY(position.y);
        circle.radius(this.canvasProperties.brushWidth);
        circle.moveToTop();
        lastLine.strokeWidth(lastLine.strokeWidth() + 0.3);
      }
      const newPoints = lastLine.points().concat([position.x, position.y]);
      lastLine.points(newPoints);
      this.layer.getStage().batchDraw();
      await this.sendCanvas();
    });
  }

  async sendCanvas(stage?: any): Promise<void> {
    let stageView = this.stage;
    if (stage) {
      stageView = stage;
    }
    const roomId = localStorage.getItem('roomId');
    const data = {
      canvas: stageView.getStage().toDataURL(), roomId
    };
    this.socketsService.sendMessage(data, 'canvasState');
  }


  setActualColor(event): void {
    this.canvasProperties.actualColor = event;
  }

  setMode(event): void {
    this.canvasProperties.mode = 'brush';
    if (event) {
      this.canvasProperties.mode = 'rubber';
    }
  }

  deleteCanvas(stage, canvasContainer): void {
    const layers = stage.getStage().find('Line');
    layers.forEach((line) => {
      line.destroy();
    });
    const parentContainer = canvasContainer.nativeElement;
    parentContainer.style.backgroundColor = 'white';
    stage.getStage().batchDraw();
    this.sendCanvas(stage).then();

  };

  fitCanvasIntoParentContainer(stage): void {
    const containerWidth = this.getWidthOfParentContainerById();
    let scale = containerWidth / this.canvasSize.width - (((1920 / 1.6) - this.canvasSize.width) / (this.canvasSize.width));
    let scaledCanvas = {width: this.canvasSize.width * scale, height: this.canvasSize.height * scale};
    if (this.isCanvasScaleInDefaultRange(scaledCanvas)) {
      scale = 1;
      scaledCanvas = {width: this.canvasSize.width, height: this.canvasSize.height};
    }
    if (CanvasComponent.isMobile(scaledCanvas.width)) {
      const dimensionMobile = {width: 300, height: scaledCanvas.height};
      this.scaleCanvas(dimensionMobile, stage);
    } else {
      this.scaleCanvas(scaledCanvas, stage);
    }

  }


  fillLine(line, color): void {
    if (!line) {
      return;
    }
    const len = line.attrs.points.length - 1;
    line.closed(true);
    line.fillLinearGradientStartPoint({x: line.attrs.points[0], y: line.attrs.points[1]});
    line.fillLinearGradientEndPoint({x: line.attrs.points[len - 2], y: line.attrs.points[len - 1]});
    line.fillLinearGradientColorStops([0, color, 1, color]);
  }

  getWidthOfParentContainerById(): number {
    return window.innerWidth;
  }

  isCanvasScaleInDefaultRange(scaledCanvas): boolean {
    return scaledCanvas.width > (1000);
  }

  scaleCanvas(scaledCanvas, stage): void {
    stage.getStage().width(scaledCanvas.width);
    stage.getStage().batchDraw();
  }

  setBrushWidth(width: number): void {
    this.canvasProperties.brushWidth = width;
  }

  getRectangle(array): number {
    if (!array) {
      return;
    }
    const length = array.length;
    const pointAY = array[1];
    const pointBY = array[Number((length / 4)) + 1];
    const pointBX = array[Number(length / 4)];
    const pointCX = array[Number(length * (3 / 4))];
    const h = this.countPoints(pointAY, pointBY);
    const w = this.countPoints(pointBX, pointCX);
    return h * w;
  }

  countPoints(pointA: number, pointB: number): number {
    return Math.abs(pointA) + Math.abs(pointB);
  }

  collisionDetect(position, square: number): boolean {
    return position.x >= 0 && square > position.x && position.y >= 0 && position.y <= square;
  }

  fillObject(isFill: boolean): void {
    this.isFill = isFill;
  }

  onDeleteCanvas(): void {
    this.deleteCanvas(this.stage, this.canvasContainer);
    this.layer.getStage().batchDraw();
  }
}
