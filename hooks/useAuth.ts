import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect } from "react";
import { useMutation } from "react-query";
import { login, refresh } from "../queries/auth";
import cookieCutter from "cookie-cutter";
import { useAppContext } from "../context/appContext";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRY_TIME_COOKIE,
  REFRESH_TOKEN_COOKIE,
  USER_ID_COOKIE,
} from "../constants";

export const useAuth = () => {
  const { query, isReady: isRouterReady, push: pushToRouter } = useRouter();
  const { code, state } = query;
  const { setAccessToken, setUserId } = useAppContext();

  const {
    data: loginData,
    isSuccess: isLoginSuccess,
    isLoading: isLoginLoading,
    mutate: doLogin,
  } = useMutation("login", () => login(code as string));
  const {
    data: refreshData,
    isSuccess: isRefreshSuccess,
    isLoading: isRefreshLoading,
    mutate: doRefresh,
  } = useMutation("refresh", refresh);

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
    pushToRouter(
      "https://accounts.spotify.com/authorize?".concat(params.toString())
    );
  }, [pushToRouter]);

  useEffect(() => {
    if (isRefreshSuccess) {
      const { accessToken, expiryTime, refreshToken } = refreshData;

      accessToken && cookieCutter.set(ACCESS_TOKEN_COOKIE, accessToken);
      expiryTime && cookieCutter.set(EXPIRY_TIME_COOKIE, expiryTime);
      refreshToken && cookieCutter.set(REFRESH_TOKEN_COOKIE, refreshToken);

      setAccessToken(accessToken);
    }
  });

  useEffect(() => {
    if (isLoginSuccess) {
      const { accessToken, expiryTime, refreshToken, userId } = loginData;

      accessToken && cookieCutter.set(ACCESS_TOKEN_COOKIE, accessToken);
      expiryTime && cookieCutter.set(EXPIRY_TIME_COOKIE, expiryTime);
      refreshToken && cookieCutter.set(REFRESH_TOKEN_COOKIE, refreshToken);
      userId && cookieCutter.set(USER_ID_COOKIE, userId);

      setAccessToken(accessToken);
      setUserId(userId);
    }
  });

  useEffect(() => {
    const accessTokenCookie = cookieCutter.get(ACCESS_TOKEN_COOKIE);
    const expiryTimeCookie = cookieCutter.get(EXPIRY_TIME_COOKIE);
    const refreshTokenCookie = cookieCutter.get(REFRESH_TOKEN_COOKIE);
    const userIdCookie = cookieCutter.get(USER_ID_COOKIE);

    const isExpired = expiryTimeCookie ? Date.now() > expiryTimeCookie : true;

    if (accessTokenCookie && refreshTokenCookie) {
      if (isExpired) {
        doRefresh(refreshTokenCookie);
      } else {
        setAccessToken(accessTokenCookie);
        setUserId(userIdCookie);
      }
    } else if (isRouterReady) {
      code ? doLogin() : redirectToAuth();
    }
  }, [
    code,
    doLogin,
    doRefresh,
    isRouterReady,
    redirectToAuth,
    setAccessToken,
    setUserId,
  ]);

  return {
    isLoading: isLoginLoading || isRefreshLoading,
  };
};
