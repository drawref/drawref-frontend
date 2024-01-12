import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metadata: {},
};

export const sessionMetadataSlice = createSlice({
  name: "sessionMetadata",
  initialState,
  reducers: {
    changeMetadata: (state, action) => {
      const { key, name, value } = action.payload;
      if (!state.metadata[key]) {
        state.metadata[key] = {};
      }
      state.metadata[key][name] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeMetadata } = sessionMetadataSlice.actions;

export default sessionMetadataSlice.reducer;
