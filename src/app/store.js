import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "./apiSlice";
import { sessionMetadataSlice } from "./sessionMetadataSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    sessionMetadata: sessionMetadataSlice.reducer,
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

// configure listeners using the provided defaults
setupListeners(store.dispatch);
