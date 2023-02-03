import type { RootState } from "../store";

// Other code such as selectors can use the imported `RootState` type
export const activeUsers = (state: RootState) => state.stakinginfo.activeUsers;
export const currentRound = (state: RootState) => state.stakinginfo.currentRound;
export const roundStart = (state: RootState) => state.stakinginfo.roundStart;
export const roundStaked = (state: RootState) => state.stakinginfo.roundStaked;
export const roundDuration = (state: RootState) => state.stakinginfo.roundDuration;
export const totalRounds = (state: RootState) => state.stakinginfo.totalRounds;
export const stakingStart = (state: RootState) => state.stakinginfo.stakingStart;
export const totalStaked = (state: RootState) => state.stakinginfo.totalStaked;
export const roundUsers = (state: RootState) => state.stakinginfo.roundUsers;
export const minCap = (state: RootState) => state.stakinginfo.minCap;