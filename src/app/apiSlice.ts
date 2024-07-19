import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category, Tag } from "../types/drawref";

interface AddCategoryRequest {
  token: string;
  body: Category;
}

interface ModifyCategoryResponse {
  id: string;
}

interface EditCategoryRequest {
  token: string;
  id: string;
  body: Category;
}

interface DeleteCategoryRequest {
  token: string;
  id: string;
}

interface AddImageRequest {
  token: string;
  body: {
    path?: string;
    external_url?: string;
    author?: string;
    author_url?: string;
  };
}

interface AddImageResponse {
  id: number;
  url: string;
}

interface AddImageToCategoryRequest {
  token: string;
  category: string;
  image: number;
  body: {
    tags: Tag[];
  };
}

interface OkResponse {
  ok: boolean;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_DRAWREF_API,
  }),
  tagTypes: ["categories", "category-images"],
  endpoints: (build) => ({
    // categories
    //
    addCategory: build.mutation<ModifyCategoryResponse, AddCategoryRequest>({
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
    editCategory: build.mutation<ModifyCategoryResponse, EditCategoryRequest>({
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
    deleteCategory: build.mutation<OkResponse, DeleteCategoryRequest>({
      query: ({ token, id }) => ({
        url: `categories/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["categories"],
    }),
    getCategories: build.query<Category[], void>({
      query: () => `categories`,
      providesTags: ["categories"],
    }),
    getCategory: build.query<Category, string>({
      query: (id) => `categories/${id}`,
      providesTags: ["categories"],
    }),

    // images
    //
    addImage: build.mutation<AddImageResponse, AddImageRequest>({
      query: ({ token, body }) => ({
        url: `image`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
    }),
    addImageToCategory: build.mutation<OkResponse, AddImageToCategoryRequest>({
      query: ({ token, category, image, body }) => ({
        url: `categories/${category}/images/${image}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["category-images"],
    }),
    deleteImageFromCategory: build.mutation({
      query: ({ token, category, image }) => ({
        url: `categories/${category}/images/${image}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["category-images"],
    }),
    getCategoryImages: build.query({
      query: ({ category, page }) => ({
        url: `categories/${category}/images`,
        method: "GET",
        params: {
          page,
        },
      }),
      providesTags: ["category-images"],
    }),
    getImageSources: build.query({
      query: () => ({
        url: `image/sources`,
        method: "GET",
      }),
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
    getAvailableImageCount: build.query({
      query: ({ categoryId, tags }) => ({
        url: `session/count`,
        method: "GET",
        params: {
          category: categoryId,
          tags: JSON.stringify(tags),
        },
      }),
      providesTags: ["category-images"],
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

    // sample data
    //
    getSampleData: build.query({
      query: ({ token }) => ({
        url: `samples`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    addSampleData: build.mutation({
      query: ({ token, body }) => ({
        url: `samples/import`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["categories", "category-images"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useAddImageMutation,
  useAddImageToCategoryMutation,
  useDeleteImageFromCategoryMutation,
  useGetCategoryImagesQuery,
  useGetImageSourcesQuery,
  useGetSessionQuery,
  useGetAvailableImageCountQuery,
  useGetUserQuery,
  useGetSampleDataQuery,
  useAddSampleDataMutation,
} = api;
