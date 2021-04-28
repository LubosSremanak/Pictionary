export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  operator: boolean;
  drawer: boolean;
  points: number;
  correctRound: boolean;
}
