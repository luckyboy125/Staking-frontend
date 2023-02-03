import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/index";
import spinnerReducer from "./spinner/index";
import stakinginfoReducer from "./initstakinginfo/index";
import alertReducer from "./alert/index";
import netModalReducer from "./netmodal/index";
import refreshReducer from "./refresh/index";

export const store = configureStore({
  reducer: {
    spinner: spinnerReducer,
    auth: authReducer,
    stakinginfo:stakinginfoReducer,
    alert: alertReducer,
    refresh: refreshReducer,
    netModal: netModalReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
