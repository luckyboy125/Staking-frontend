import { createAsyncThunk } from "@reduxjs/toolkit";
import { useInitZnxStake } from "../../hooks/Initznxstake";

const setStakinginfo = createAsyncThunk("Stakinginfo/get", async () => {
  const payload = await useInitZnxStake();
  return payload;
});

export { setStakinginfo };
