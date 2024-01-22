import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_DRAWREF_API,
  }),
  tagTypes: ["categories"],
  endpoints: (build) => ({
    // categories
    //
    addCategory: build.mutation({
      query: ({ token, body }) => ({
        url: `categories`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["categories"],
    }),
    editCategory: build.mutation({
      query: ({ id, token, body }) => ({
        url: `categories/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["categories"],
    }),
    getCategories: build.query({
      query: () => `categories`,
      providesTags: ["categories"],
    }),
    getCategory: build.query({
      query: (id) => `categories/${id}`,
      providesTags: ["categories"],
    }),

    // images
    //
    addImage: build.mutation({
      query: ({ token, body }) => ({
        url: `image`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
    }),
    addImageToCategory: build.mutation({
      query: ({ token, category, image, body }) => ({
        url: `categories/${category}/images/${image}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["categories"],
    }),

    // sessions
    //
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

    // user data
    //
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

export const {
  useAddCategoryMutation,
  useEditCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useAddImageMutation,
  useAddImageToCategoryMutation,
  useGetSessionQuery,
  useGetUserQuery,
} = api;
