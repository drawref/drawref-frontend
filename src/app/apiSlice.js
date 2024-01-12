import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_DRAWREF_API,
  }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `categories`,
    }),
    getSession: builder.query({
      query: () => `session`,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetSessionQuery } = api;
