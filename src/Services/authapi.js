import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { setToken, clearToken } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://crowsolvebackend.onrender.com",
  credentials: "include", // for refresh token cookie
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to refresh token
    const refreshResult = await baseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);
    if (refreshResult.data) {
      api.dispatch(setToken({ accessToken: refreshResult.data.accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearToken());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Problems", "Solutions"], // add "Solutions"
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
    }),

    uploadProblem: builder.mutation({
      query: (problem) => {
        const formData = new FormData();
        formData.append("title", problem.title);
        formData.append("description", problem.description);
        formData.append("location", problem.location);
        formData.append("image", problem.image);

        return {
          url: "/problems",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Problems"],
    }),

    getProblems: builder.query({
      query: () => ({
        url: "/problems",
        method: "GET",
      }),
      providesTags: ["Problems"],
    }),

    submitSolution: builder.mutation({
      query: ({ problemId, text }) => ({
        url: `/solutions/${problemId}`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Solutions"], // so list updates after submit
    }),

    getSolutions: builder.query({
      query: (problemId) => `/solutions/${problemId}`,
      providesTags: ["Solutions"], // cache tag for solutions
    }),

    voteSolution: builder.mutation({
      query: (solutionId) => ({
        url: `/votes/${solutionId}`,
        method: "POST",
      }),
      invalidatesTags: ["Solutions"], // invalidate after voting
    }),
  }),
});


export const { useLoginMutation, useRegisterMutation, useUploadProblemMutation,useGetProblemsQuery,useSubmitSolutionMutation,useGetSolutionsQuery,useVoteSolutionMutation } = authApi;