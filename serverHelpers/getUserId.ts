import axios from "axios";
import { buildHeaders } from "../util/headers";

export const getUserId = async (
  accessToken: string
): Promise<string | Error> => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: buildHeaders(accessToken),
    });

    return response?.data.id;
  } catch (error: any) {
    return new Error(`error fetching userId: ${error.message}`);
  }
};
