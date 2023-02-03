import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showNetModal } from "./actions";
import type { netModalState } from "./types";

const PREFIX = "netmodal";

const initialState: netModalState = {
  netModalShow: false,
};

export const netModalReducer = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    updateAlert: (state: netModalState, action: PayloadAction<any>) => {
      if (action.payload !== null) {
        state.netModalShow = action.payload.netModalShow;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      showNetModal.fulfilled.type,
      (state: netModalState, action: PayloadAction<any>) => {
        state.netModalShow = action.payload.netModalShow;
      }
    );
  },
});

export const { updateAlert } = netModalReducer.actions;

export { showNetModal };

export default netModalReducer.reducer;
