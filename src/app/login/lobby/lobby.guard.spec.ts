import { TestBed } from '@angular/core/testing';

import { LobbyGuard } from './lobby.guard';

describe('LobbyGuard', () => {
  let guard: LobbyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LobbyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
