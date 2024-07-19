import { createSlice } from "@reduxjs/toolkit";

interface SessionTagsState {
  tags: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

const initialState: SessionTagsState = {
  tags: {},
};

export const sessionTagsSlice = createSlice({
  name: "sessionTags",
  initialState,
  reducers: {
    changeTags: (state, action) => {
      const { key, name, value } = action.payload;
      if (!state.tags[key]) {
        state.tags[key] = {};
      }
      state.tags[key][name] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeTags } = sessionTagsSlice.actions;

export default sessionTagsSlice.reducer;
