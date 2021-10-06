import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect } from "react";
import { useLogin, useRefresh } from "../queries/auth";
import { getAuthCookies, setAuthCookies } from "../helpers/cookies";

export const useAuth = () => {
  const router = useRouter();
  const { code, state } = router.query;

  const { mutate: doLogin, ...loginMutation } = useLogin();
  const { mutate: doRefresh, ...refreshMutation } = useRefresh();

  const redirectToAuth = useCallback(async () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID || "",
      response_type: "code",
      redirect_uri: process.env.NEXT_PUBLIC_BASE_URL || "",
      scope: [
        "playlist-read-private",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-library-read",
      ].join(" "),
    });
    router.push(
      "https://accounts.spotify.com/authorize?".concat(params.toString())
    );
  }, [router]);

  useEffect(() => {
    if (refreshMutation.isSuccess) {
      const { accessToken, expiryTime, refreshToken } = refreshMutation.data;
      setAuthCookies({ accessToken, expiryTime, refreshToken });
    }
  }, [refreshMutation.data, refreshMutation.isSuccess]);

  useEffect(() => {
    if (loginMutation.isSuccess) {
      const { accessToken, expiryTime, refreshToken, userId } =
        loginMutation.data;

      setAuthCookies({ accessToken, expiryTime, refreshToken, userId });
    }
  }, [loginMutation.data, loginMutation.isSuccess]);

  useEffect(() => {
    const { accessTokenCookie, expiryTimeCookie, refreshTokenCookie } =
      getAuthCookies();

    const isExpired = expiryTimeCookie
      ? Date.now() > parseInt(expiryTimeCookie)
      : true;

    if (accessTokenCookie && refreshTokenCookie && isExpired) {
      doRefresh({ refreshToken: refreshTokenCookie });
    } else if (router.isReady) {
      code ? doLogin({ code: code as string }) : redirectToAuth();
    }
  }, [code, doLogin, doRefresh, redirectToAuth, router.isReady]);

  return {
    isAuthenticating: loginMutation.isLoading || refreshMutation.isLoading,
  };
};
