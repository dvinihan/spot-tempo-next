import axios from "axios";

const wait = (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

// Some calls (usually the ones to get audio-features) get overloaded and result in 429 "Too many requests" errors from Spotify
// This interceptor will handle retries
export const addRetryHandler = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 429) {
        const retryAfterHeader: string = error.response.headers["retry-after"];
        const retryAfterSeconds: number = parseInt(retryAfterHeader) ?? 3;

        await wait(retryAfterSeconds);

        return axios.request(error.config);
      }

      return Promise.reject(error);
    }
  );
};
