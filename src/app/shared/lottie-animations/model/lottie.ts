import {AnimationItem} from 'lottie-web';

export class Lottie {
  constructor(id: string, options: any) {
    this._id = id;
    this.options = options;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _reference: AnimationItem;

  get reference(): AnimationItem {
    return this._reference;
  }

  set reference(value: AnimationItem) {
    this._reference = value;
  }

  private _options: any;

  get options(): any {
    return this._options;
  }

  set options(value: any) {
    this._options = value;
  }
}
