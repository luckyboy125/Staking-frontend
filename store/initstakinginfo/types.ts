interface Stakingstate {
  activeUsers: any;
  currentRound: number;
  roundStart: number;
  roundStaked: string;
  roundDuration:number;
  totalRounds:number;
  stakingStart: number;
  totalStaked: string;
  roundUsers: any;
  minCap: string;
}

export type { Stakingstate };
