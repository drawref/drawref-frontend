import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface UploadImageRequest {
  token: string;
  body: FormData;
}

interface UploadImageResponse {
  path: string;
}

export const upload = createApi({
  reducerPath: "upload",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_DRAWREF_UPLOAD,
  }),
  endpoints: (build) => ({
    uploadImage: build.mutation<UploadImageResponse, UploadImageRequest>({
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
