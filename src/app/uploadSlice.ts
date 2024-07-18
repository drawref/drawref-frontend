import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const upload = createApi({
  reducerPath: "upload",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_DRAWREF_UPLOAD,
  }),
  endpoints: (build) => ({
    uploadImage: build.mutation({
      query: ({ token, body }) => ({
        url: `image`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
        formData: true,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = upload;
