import { createSlice } from "@reduxjs/toolkit";

const initialState: number = -1;

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal(_state, action: { payload: number; type: string }) {
      return action.payload;
    },
  },
});

export const modalAction = modalSlice.actions;

export default modalSlice.reducer;
