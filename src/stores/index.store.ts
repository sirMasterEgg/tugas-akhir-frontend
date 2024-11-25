import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/auth.slice.ts";
import modalSlice from "../slices/modal.slice.ts";
import modalFindGroupSlice from "../slices/modal-find-group.slice.ts";

const store = configureStore({
  reducer: {
    auth: authSlice,
    modal: modalSlice,
    modalFindGroup: modalFindGroupSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
