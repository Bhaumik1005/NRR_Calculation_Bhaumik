export class CalculateNRRDto {
  team: string;
  opponent: string;
  overs: number; // e.g., 20
  desiredPosition: number; // 1-based index
  tossResult: 'Batting First' | 'Bowling First';
  runsScored?: number; // required when Batting First
  opponentRuns?: number; // required when Bowling First
}
