import {Injectable} from '@angular/core';
import {Sex} from './sex.enum';

@Injectable({
  providedIn: 'root'
})
export class AvatarGeneratorService {

  private joeSchmoAvatarUrl = 'https://joeschmoe.io/api/v1/';
  private avatarMale =
    ['jia', 'jean', 'james', 'josh', 'joe', 'jerry', 'jude', 'jack',
      'jon', 'jordan', 'jake', 'jed', 'jacques', 'jai'];
  private avatarFemale =
    ['jazebelle', 'jane', 'jocelyn', 'jenni', 'jabala', 'jana', 'jess',
      'jeane', 'jeri', 'jodi', 'jolee', 'josephine', 'jaqueline',
      'julie'];

  constructor() {
  }

  generateAvatarUrlBySex(sex: Sex): string {
    const randomMale = Math.floor(Math.random() * this.avatarMale.length);
    const randomFemale = Math.floor(Math.random() * this.avatarFemale.length);
    const random = sex === Sex.MALE ? this.avatarMale[randomMale] : this.avatarFemale[randomFemale];
    return this.joeSchmoAvatarUrl + Sex[sex].toLowerCase() + '/' + random + '?' + new Date().getTime();
  }
}
