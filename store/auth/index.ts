import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setAuth, removeAuth, setAuthWith, setAuthMore } from "./actions";
import type { authstate } from "./types";

const PREFIX = "auth";

const initialState: authstate = {
  loginAddress: "",
  balance: 0,
};

const handleAuth = (state: authstate, res: any) => {
  state.loginAddress = res.loginAddress;
  state.balance = res.balance;
};

const logout = (state: authstate) => {
  state.loginAddress = "";
  state.balance = 0;
};

export const authReducer = createSlice({
  name: PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      setAuth.fulfilled.type,
      (state: authstate, action: PayloadAction<any>) => {
        handleAuth(state, action.payload);
      }
    );
    builder.addCase(
      setAuthWith.fulfilled.type,
      (state: authstate, action: PayloadAction<any>) => {
        handleAuth(state, action.payload);
      }
    );
    builder.addCase(
      setAuthMore.fulfilled.type,
      (state: authstate, action: PayloadAction<any>) => {
        handleAuth(state, action.payload);
      }
    );
    builder.addCase(removeAuth.fulfilled.type, (state: authstate) => {
      logout(state);
    });
  },
});

export { setAuth, removeAuth, setAuthWith, setAuthMore };

export default authReducer.reducer;
