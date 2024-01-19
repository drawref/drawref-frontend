import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_DRAWREF_API,
  }),
  tagTypes: ["categories"],
  endpoints: (build) => ({
    addCategory: build.mutation({
      query: (body) => ({
        url: `categories`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["categories"],
    }),
    getCategories: build.query({
      query: () => `categories`,
      providesTags: ["categories"],
    }),
    getSession: build.query({
      query: ({ categoryId, tags }) => ({
        url: `session`,
        method: "GET",
        params: {
          category: categoryId,
          tags: JSON.stringify(tags),
        },
      }),
    }),
    getUser: build.query({
      query: ({ token }) => ({
        url: `user`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useAddCategoryMutation, useGetCategoriesQuery, useGetSessionQuery, useGetUserQuery } = api;
