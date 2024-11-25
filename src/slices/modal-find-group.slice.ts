import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const modalFindGroupSlice = createSlice({
  name: "modal-find-group",
  initialState,
  reducers: {
    setModal(_state, action: { payload: boolean; type: string }) {
      return action.payload;
    },
  },
});

export const modalFindGroupAction = modalFindGroupSlice.actions;

export default modalFindGroupSlice.reducer;
