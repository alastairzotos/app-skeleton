import axios from "axios";
import { apiEndpoint } from "../utils/env";
import { useAuthState } from "../state/auth";

export const httpClient = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use(
  config => {
    const { accessToken } = useAuthState.getState();

    if (config.headers && accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
)

httpClient.interceptors.response.use(
  response => {
    if (response.status >= 300) {
      console.error(response.data);
      return Promise.reject(response.data);
    }

    return response;
  },
  (error) => {
    console.error(error);
    throw new Error(error.response.data?.message || error.response.statusText)
  }
)
