import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../context/appContext";
import { login } from "../queries/auth";

export const useAuth = () => {
  const router = useRouter();
  const { code, state } = router.query;

  const { setAccessToken, setUserId } = useAppContext();

  const authorizeSpotify = async () => {
    await axios.get("https://accounts.spotify.com/authorize", {
      params: {
        client_id: process.env.CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.BASE_URL,
        scope: [
          "playlist-read-private",
          "playlist-modify-private",
          "playlist-modify-public",
          "user-library-read",
        ].join(" "),
      },
    });
  };

  const authQuery = useQuery("auth", authorizeSpotify);

  const loginMutation = useMutation("login", () => login(code as string));

  useEffect(() => {
    if (code) {
      loginMutation.mutate();
    }
  });

  useEffect(() => {
    if (loginMutation.isSuccess) {
      setAccessToken(loginMutation.data.accessToken);
      setUserId(loginMutation.data.userId);
    }
  });

  return {
    isLoading: authQuery.isLoading || loginMutation.isLoading,
  };
};
