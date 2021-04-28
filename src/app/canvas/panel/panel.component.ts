import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-canvas-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, AfterViewInit {
  @Output() actualColor: EventEmitter<string>;
  @Output() deleteAll: EventEmitter<boolean>;
  @Output() isRubber: EventEmitter<boolean>;
  @Output() fill: EventEmitter<boolean>;
  @Output() brushWidth: EventEmitter<number>;
  @ViewChild('brush') brush: MatButton;
  private active: boolean;
  private readonly _actualPickerColors: { backgroundColor: string }[];

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.actualColor = new EventEmitter<string>();
    this.deleteAll = new EventEmitter<boolean>();
    this.fill = new EventEmitter<boolean>();
    this.isRubber = new EventEmitter<boolean>();
    this.brushWidth = new EventEmitter<number>();
    this.active = false;
    this._colors = ['#080808', '#F6E8EA', '#EF626C', '#79B473'];
    this._actualPickerColors = this.createPickerColors();
    this.matIconRegistry.addSvgIcon(
      'brushLS',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/brush.svg'));
    this.matIconRegistry.addSvgIcon(
      'rubberLS',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/rubber.svg'));
    this.matIconRegistry.addSvgIcon(
      'deleteAllLS',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/deleteAll.svg'));
    this.matIconRegistry.addSvgIcon(
      'fillLS',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/fill.svg'));
  }

  private _colors: string[];

  get colors(): string[] {
    return this._colors;
  }

  set colors(value: string[]) {
    this._colors = value;
  }

  get actualPickerColors(): { backgroundColor: string }[] {
    return this._actualPickerColors;
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  logger(colorPicker: HTMLInputElement): void {
    console.log(colorPicker.value);
  }

  getColor(colorPicker: HTMLInputElement, index: number, colorsPanel: HTMLDivElement): void {
    this.actualColor.emit(String(colorPicker.value));
    this._actualPickerColors[index] = {backgroundColor: colorPicker.value};
    this.brush._getHostElement().style.color = this.actualPickerColors[index].backgroundColor;
    colorsPanel.style.boxShadow = '0 4px 8px 0' + this.actualPickerColors[index].backgroundColor;
  }

  chooseColor(index: number, colorsPanel: HTMLDivElement): void {
    this.actualColor.emit(this._actualPickerColors[index].backgroundColor);
    this.brush._getHostElement().style.color = this.actualPickerColors[index].backgroundColor;
    colorsPanel.style.boxShadow = '0 4px 8px 0' + this.actualPickerColors[index].backgroundColor;
  }

  private createPickerColors(): { backgroundColor: string }[] {
    const pickerColors = [];
    this._colors.forEach((color) => {
      pickerColors.push({backgroundColor: color});
    });
    return pickerColors;
  }

  brushClick(rubber: MatButton, fill: MatButton): void {
    this.isRubber.emit(false);
    fill._getHostElement().style.color = '#080808';
    rubber._getHostElement().style.color = '#080808';
    this.fill.emit(false);
  }

  rubberClick(rubber: MatButton, fill: MatButton): void {
    this.isRubber.emit(true);
    this.fill.emit(false);
    rubber._getHostElement().style.color = '#8d0000';
    fill._getHostElement().style.color = '#080808';
  }

  fillCLick(fill: MatButton, rubber: MatButton): void {
    this.fill.emit(true);
    rubber._getHostElement().style.color = '#080808';
    fill._getHostElement().style.color = '#8d0000';
  }

  deleteAllClick(fill: MatButton, rubber: MatButton): void {
    this.deleteAll.emit(true);
    fill._getHostElement().style.color = '#080808';
    rubber._getHostElement().style.color = '#080808';
    this.fill.emit(false);
  }
}
