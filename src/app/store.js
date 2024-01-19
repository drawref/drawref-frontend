import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "./apiSlice";
import { sessionTagsSlice } from "./sessionTagsSlice";
import { userProfileSlice, login, logout } from "./userProfileSlice";

// listener middleware, used to send store data to local storage
const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: login,
  effect: async (action, listenerApi) => {
    localStorage.setItem("drawref-login", JSON.stringify(action.payload));
  },
});
listenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (action, listenerApi) => {
    localStorage.removeItem("drawref-login");
  },
});

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    sessionTags: sessionTagsSlice.reducer,
    userProfile: userProfileSlice.reducer,
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(api.middleware),
});

// configure listeners using the provided defaults
setupListeners(store.dispatch);

// load details from local storage
const loginDetails = JSON.parse(localStorage.getItem("drawref-login") || "{}");
const loginExpirationTime = new Date(loginDetails.exp || "1995-12-17T03:24:00").getTime();
if (loginDetails && new Date().getTime() < loginExpirationTime) {
  store.dispatch(login(loginDetails));
}
