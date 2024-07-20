import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category, Image, TagMap } from "../types/drawref";

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
    tags: TagMap;
  };
}

interface DeleteImageFromCategoryRequest {
  token: string;
  category: string;
  image: number;
}

interface GetCategoryImagesRequest {
  category: string;
  page: number;
}

interface GetSessionRequest {
  category: string;
  tags: TagMap;
}

interface GetAvailableImageCountResponse {
  images: number;
}

interface RequestWithToken {
  token: string;
}

interface GetUserResponse {
  name: string;
  admin: boolean;
  exp: string;
}

interface GetSampleDataResponse {
  categories: Category[];
  images: {
    author: string;
    author_url: string;
    requirement: string;
    image_count: number;
  }[];
}

interface AddSampleDataRequest {
  token: string;
  body: {
    categories: string[];
    images: string[];
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
    deleteImageFromCategory: build.mutation<OkResponse, DeleteImageFromCategoryRequest>({
      query: ({ token, category, image }) => ({
        url: `categories/${category}/images/${image}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["category-images"],
    }),
    getCategoryImages: build.query<Image[], GetCategoryImagesRequest>({
      query: ({ category, page }) => ({
        url: `categories/${category}/images`,
        method: "GET",
        params: {
          page,
        },
      }),
      providesTags: ["category-images"],
    }),
    getImageSources: build.query<string[][], void>({
      query: () => ({
        url: `image/sources`,
        method: "GET",
      }),
    }),

    // sessions
    //
    getSession: build.query<Image[], GetSessionRequest>({
      query: ({ category, tags }) => ({
        url: `session`,
        method: "GET",
        params: {
          category: category,
          tags: JSON.stringify(tags),
        },
      }),
    }),
    getAvailableImageCount: build.query<GetAvailableImageCountResponse, GetSessionRequest>({
      query: ({ category, tags }) => ({
        url: `session/count`,
        method: "GET",
        params: {
          category: category,
          tags: JSON.stringify(tags),
        },
      }),
      providesTags: ["category-images"],
    }),

    // user data
    //
    getUser: build.query<GetUserResponse, RequestWithToken>({
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
    getSampleData: build.query<GetSampleDataResponse, RequestWithToken>({
      query: ({ token }) => ({
        url: `samples`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    addSampleData: build.mutation<OkResponse, AddSampleDataRequest>({
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
