import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setRefreshStatus } from "./actions";
import type { refreshState } from "./types";

const PREFIX = "refresh";

const initialState: refreshState = {
  status: false,
};

export const refreshReducer = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    updateRefresh: (state: refreshState, action: PayloadAction<any>) => {
      if (action.payload !== null) {
        state.status = action.payload.refreshStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      setRefreshStatus.fulfilled.type,
      (state: refreshState, action: PayloadAction<any>) => {
        state.status = action.payload.refreshStatus;
      }
    );
  },
});

export const { updateRefresh } = refreshReducer.actions;

export { setRefreshStatus };

export default refreshReducer.reducer;
