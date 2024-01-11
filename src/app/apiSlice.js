import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_DRAWREF_API,
  }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (name) => `categories`,
    }),
  }),
});

export const { getCategories } = api;
