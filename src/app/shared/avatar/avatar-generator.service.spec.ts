import { TestBed } from '@angular/core/testing';

import { AvatarGeneratorService } from './avatar-generator.service';

describe('AvatarGeneratorService', () => {
  let service: AvatarGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
