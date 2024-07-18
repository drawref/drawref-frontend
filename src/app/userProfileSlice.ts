import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfileData {
  admin: boolean;
  name: string;
  exp: string;
  token: string;
}

interface UserProfileState {
  loggedIn: boolean;
  admin: boolean;
  name: string;
  exp: string;
  token: string;
}

const initialState: UserProfileState = {
  loggedIn: false,
  admin: false,
  name: "User",
  exp: "",
  token: "",
};

export const userProfileSlice = createSlice({
  name: "sessionMetadata",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfileData>) => {
      const { name, admin, exp, token } = action.payload;
      state.loggedIn = true;
      state.admin = admin;
      state.name = name;
      state.exp = exp;
      state.token = token;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.admin = false;
      state.name = "User";
      state.exp = "";
      state.token = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = userProfileSlice.actions;

export default userProfileSlice.reducer;
