export class CanvasProperties {


  constructor() {
    this._mode = 'brush';
    this.backgroundColor = 'white';
    this.actualColor = 'black';
    this._brushWidth = 2;
  }

  private _brushWidth: number;

  get brushWidth(): number {
    return this._brushWidth;
  }

  set brushWidth(value: number) {
    this._brushWidth = value;
  }

  private _mode: string;

  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    this._mode = value;
  }

  private _backgroundColor: string;

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  set backgroundColor(value: string) {
    this._backgroundColor = value;
  }

  private _actualColor: string;

  get actualColor(): string {
    return this._actualColor;
  }

  set actualColor(value: string) {
    this._actualColor = value;
  }
}
