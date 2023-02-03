import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { setStakinginfo } from "./actions";
import type { Stakingstate } from "./types";

const PREFIX = "Stakinginfo";

const initialState: Stakingstate = {
  activeUsers: [],
  currentRound: 0,
  roundStart: 0,
  roundStaked: "0",
  roundDuration: 0,
  totalRounds: 0,
  stakingStart: 0,
  totalStaked: "0",
  roundUsers: [],
  minCap: "0",
};

const handleStakinginfo = (state: Stakingstate, res: any) => {
  state.activeUsers = res.activeUsers;
  state.currentRound = Number(res.currentRound);
  state.roundStart = Number(res.roundStart);
  state.roundStaked = ethers.utils.formatUnits(res.roundStaked, 18);
  state.roundDuration = Number(res.roundDuration);
  state.totalRounds = Number(res.totalRounds);
  state.stakingStart = Number(res.stakingStart);
  state.totalStaked = ethers.utils.formatUnits(res.totalStaked, 18);
  state.roundUsers = res.roundUsers;
  state.minCap = ethers.utils.formatUnits(res.minCap, 18);
};

export const stakinginfoReducer = createSlice({
  name: PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      setStakinginfo.fulfilled.type,
      (state: Stakingstate, action: PayloadAction<any>) => {
        handleStakinginfo(state, action.payload);
      }
    );
  },
});

export { setStakinginfo };

export default stakinginfoReducer.reducer;
