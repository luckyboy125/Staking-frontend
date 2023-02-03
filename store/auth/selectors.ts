import type { RootState } from "../store";

// Other code such as selectors can use the imported `RootState` type

export const getAuthAddress = (state: RootState) => state.auth.loginAddress;
export const getAuthBalance = (state: RootState) => state.auth.balance;
