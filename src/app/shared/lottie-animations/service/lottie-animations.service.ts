import {Injectable} from '@angular/core';
import {Lottie} from '../model/lottie';
import {AnimationItem, AnimationSegment} from 'lottie-web';

@Injectable({
  providedIn: 'root'
})
export class LottieAnimationsService {
  private readonly animations: Lottie[];

  constructor() {
    this.animations = [];
  }

  get length(): number {
    return this.animations.length;
  }

  public getIndexInArrayById(id: string): number {
    return this.animations.findIndex(animation => animation.id === id);
  }

  public removeAnimationById(id: string): void {
    const index: number = this.getIndexInArrayById(id);
    this.animations.splice(index, 1);
  }

  public getLastAnimation(): Lottie {
    const numberOfTabs: number = this.animations.length;
    return this.animations[numberOfTabs - 1];
  }

  public removeLastAnimation(): void {
    this.animations.pop();
  }

  public createLottie(id: string, options: any): void {
    const animation = new Lottie(id, options);
    this.animations.push(animation);
  }

  public getAnimationById(id: string): AnimationItem {
    return this.animations.find(animation => animation.id === id).reference;

  }

  public getOptions(id: string): any {
    return this.getLottieById(id).options;
  }

  public playAnimationInRange(id: string, frames: number[], playNow: boolean): void {
    this.getAnimationById(id).playSegments(frames as AnimationSegment, playNow);
  }

  public addAnimationReference(id: string, reference: AnimationItem): void {
    this.getLottieById(id).reference = reference;
  }

  private getLottieById(id: string): Lottie {
    return this.animations.find(animation => animation.id === id);

  }
}
