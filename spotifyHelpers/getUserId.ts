import axios from "axios";
import { buildHeaders } from "../util/headers";

export const getUserId = async (accessToken: string): Promise<string> => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: buildHeaders(accessToken),
    });

    return response?.data.id;
  } catch (error: any) {
    throw new Error(`error fetching userId: ${error.message}`);
  }
};
