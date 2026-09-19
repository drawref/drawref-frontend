import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category, Image, TagMap, Source, PathMetadata } from "../types/drawref";
import { string } from "prop-types";

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

interface ReorderCategoriesRequest {
  token: string;
  body: {
    ids: string[];
  };
}

interface GetCategoryImagesRequest {
  category: string;
  page: number;
}

interface GetCategoryImagesResponse {
  images: Image[];
  total_images: number;
  page: number;
  total_pages: number;
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

interface LoginRequest {
  password?: string;
}

interface LoginResponse {
  token: string;
  level: string;
  exp: string;
}

interface SourceSlugParam {
  token: string;
  slug: string;
}

interface CreateSourceParams {
  token: string;
  body: Source;
}

interface EditSourceParams {
  token: string;
  slug: string;
  body: Source;
}

interface OkResponse {
  ok: boolean;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_DRAWREF_API || "http://localhost:3300/api/",
  }),
  tagTypes: ["categories", "category-images", "sources"],
  endpoints: (build) => ({
    loadSamples: build.mutation<OkResponse, RequestWithToken>({
      query: (args) => ({
        url: "system/load-samples",
        method: "POST",
        headers: { Authorization: `Bearer ${args.token}` },
      }),
      invalidatesTags: ["categories", "category-images", "sources"],
    }),

    // categories
    //
    addCategory: build.mutation<ModifyCategoryResponse, AddCategoryRequest>({
      query: ({ token, body }) => ({
        url: `category`,
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
        url: `category/${id}`,
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
        url: `category/${id}`,
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
      query: (id) => `category/${id}`,
      providesTags: ["categories"],
    }),
    reorderCategories: build.mutation<OkResponse, ReorderCategoriesRequest>({
      query: ({ token, body }) => ({
        url: `categories/reorder`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["categories"],
    }),

    // images
    //
    getCategoryImages: build.query<GetCategoryImagesResponse, GetCategoryImagesRequest>({
      query: ({ category, page }) => ({
        url: `category/${category}/images`,
        method: "GET",
        params: {
          page,
        },
      }),
      providesTags: ["category-images"],
    }),
    getImageAuthors: build.query<string[][], void>({
      query: () => ({
        url: `authors`,
        method: "GET",
      }),
    }),
    getDirectorySuggestions: build.query<string[], { token: string; path: string }>({
      query: ({ token, path }) => ({
        url: `system/directories`,
        method: "GET",
        params: { path },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getSourceDirectories: build.query<string[], { token: string; slug: string; path: string }>({
      query: ({ token, slug, path }) => ({
        url: `source/${slug}/directories`,
        method: "GET",
        params: { path },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // sources
    //
    getSources: build.query<Source[], RequestWithToken>({
      query: ({ token }) => ({
        url: `sources`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["sources"],
    }),
    getSource: build.query<Source, SourceSlugParam>({
      query: ({ token, slug }) => ({
        url: `source/${slug}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["sources"],
    }),
    createSource: build.mutation<OkResponse, CreateSourceParams>({
      query: ({ token, body }) => ({
        url: `source`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["sources"],
    }),
    editSource: build.mutation<OkResponse, EditSourceParams>({
      query: ({ token, slug, body }) => ({
        url: `source/${slug}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["sources"],
    }),
    deleteSource: build.mutation<OkResponse, SourceSlugParam>({
      query: ({ token, slug }) => ({
        url: `source/${slug}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["sources"],
    }),
    scanSource: build.mutation<OkResponse, SourceSlugParam>({
      query: ({ token, slug }) => ({
        url: `source/${slug}/scan`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // source path metadata
    getSourcePathMetadata: build.query<PathMetadata[], SourceSlugParam>({
      query: ({ token, slug }) => ({
        url: `source/${slug}/path-metadata`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    upsertPathMetadata: build.mutation<OkResponse, { token: string; slug: string; body: PathMetadata }>({
      query: ({ token, slug, body }) => ({
        url: `source/${slug}/path-metadata`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
    }),
    deletePathMetadata: build.mutation<OkResponse, { token: string; slug: string; id: number }>({
      query: ({ token, slug, id }) => ({
        url: `source/${slug}/path-metadata`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { id },
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
    loginUser: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: `auth`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoadSamplesMutation,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useReorderCategoriesMutation,
  useGetCategoryImagesQuery,
  useGetImageAuthorsQuery,
  useGetDirectorySuggestionsQuery,
  useGetSourceDirectoriesQuery,
  useGetSourcesQuery,
  useGetSourceQuery,
  useCreateSourceMutation,
  useEditSourceMutation,
  useDeleteSourceMutation,
  useScanSourceMutation,
  useGetSessionQuery,
  useGetSourcePathMetadataQuery,
  useUpsertPathMetadataMutation,
  useDeletePathMetadataMutation,
  useGetAvailableImageCountQuery,
  useGetUserQuery,
  useLoginUserMutation,
} = api;
