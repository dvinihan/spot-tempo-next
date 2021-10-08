import { AxiosError, AxiosPromise } from "axios";

export const retryHelper = async (request: AxiosPromise) => {
  try {
    const response = await request;
    return response;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const headers = axiosError.response.headers;

      if ("retry-after" in headers) {
        const retryAfterSeconds = parseInt(headers["retry-after"]);
        setTimeout(() => {
          retryHelper(request);
        }, retryAfterSeconds * 1000);
      }
    }
  }
};
