import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { getAuthCookies, getIsAccessTokenExpired } from "../util/cookies";

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
  const { code } = router.query;

  const { loginMutation, refreshAuthMutation } = useAppContext();
  // mutation changes would trigger a useEffect refresh on every render, so we need to isolate the mutate fn only
  const { mutate: doLogin } = loginMutation;
  const { mutate: doRefresh } = refreshAuthMutation;

  useEffect(() => {
    if (!router.isReady) return;

    if (code) {
      doLogin({ code: code as string });
      return;
    }

    const { accessTokenCookie, expiryTimeCookie, refreshTokenCookie } =
      getAuthCookies();

    const isExpired = getIsAccessTokenExpired(expiryTimeCookie);

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
