import { createSlice } from "@reduxjs/toolkit";
import { GlobalUserDto } from "../apis/dto/shared/user.dto.ts";

interface IAuthState {
  user?: GlobalUserDto;
  token: string;
}

const initialState: IAuthState = {
  user: undefined,
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: { payload: IAuthState; type: string }) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    unsetUser(state) {
      state.user = undefined;
      state.token = "";
    },
  },
});

export const authAction = authSlice.actions;

export default authSlice.reducer;
