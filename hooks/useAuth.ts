import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useLogin, useRefresh } from "../queries/auth";
import { getAuthCookies } from "../helpers/cookies";

const authParams = new URLSearchParams({
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

export const useAuth = () => {
  const router = useRouter();
  const { code, state } = router.query;

  // mutation changes would trigger a useEffect refresh on every render, so we need to isolate the mutate fn only
  const { mutate: doLogin } = useLogin();
  const { mutate: doRefresh } = useRefresh();

  useEffect(() => {
    if (!router.isReady) return;

    if (code) {
      doLogin({ code: code as string });
      return;
    }

    const { accessTokenCookie, expiryTimeCookie, refreshTokenCookie } =
      getAuthCookies();

    const isExpired = expiryTimeCookie
      ? Date.now() > parseInt(expiryTimeCookie)
      : true;

    if (accessTokenCookie && refreshTokenCookie && isExpired) {
      doRefresh({ refreshToken: refreshTokenCookie });
      return;
    }

    if (!accessTokenCookie) {
      router.push(
        "https://accounts.spotify.com/authorize?".concat(authParams.toString())
      );
    }
  }, [code, doLogin, doRefresh, router]);
};
