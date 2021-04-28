import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AnimationItem} from 'lottie-web';
import {LottieAnimationsService} from '../service/lottie-animations.service';

@Component({
  selector: 'app-lottie',
  templateUrl: './lottie.component.html',
  styleUrls: ['./lottie.component.css']
})
export class LottieComponent implements OnInit, OnDestroy {
  @Input() lottieId: string;
  @Input() path: string;
  @Input() loop;
  @Input() autoPlay;
  @Input() width;
  @Input() height;
  @Output() isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private lottieService: LottieAnimationsService) {
  }

  private _animation: AnimationItem;

  get animation(): AnimationItem {
    return this._animation;
  }

  private _animationOptions: any;

  get animationOptions(): any {
    return this._animationOptions;
  }

  ngOnDestroy(): void {
    this.lottieService.removeAnimationById(this.lottieId);
  }

  ngOnInit(): void {
    this._animationOptions = {
      path: this.path,
      loop: this.loop,
      autoplay: this.autoPlay,
    };
    if (!this.lottieId) {
      this.lottieId = String(this.lottieService.length);
      console.log('New id', this.lottieId);
    }
    if (!this.path) {
      throw new Error('"path" can\'t be empty!');
    }
    this.lottieService.createLottie(this.lottieId, this.animationOptions);
  }

  animationCreated(animationItem: AnimationItem): void {
    this._animation = animationItem;
    this.animation.setSubframe(false);
    this.lottieService.addAnimationReference(this.lottieId, this.animation);
    this.isLoaded.emit(true);
  }
}
