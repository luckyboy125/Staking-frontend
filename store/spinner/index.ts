import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showSpinner } from "./actions";
import type { spinnerState } from "./types";

const PREFIX = "spinner";

const initialState: spinnerState = {
  spinnerShow: false,
};

export const spinnerReducer = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    updateAlert: (state: spinnerState, action: PayloadAction<any>) => {
      if (action.payload !== null) {
        state.spinnerShow = action.payload.spinnerShow;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      showSpinner.fulfilled.type,
      (state: spinnerState, action: PayloadAction<any>) => {
        state.spinnerShow = action.payload.spinnerShow;
      }
    );
  },
});

export const { updateAlert } = spinnerReducer.actions;

export { showSpinner };

export default spinnerReducer.reducer;
