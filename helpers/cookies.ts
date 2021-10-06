import cookieCutter from "cookie-cutter";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRY_TIME_COOKIE,
  REFRESH_TOKEN_COOKIE,
  USER_ID_COOKIE,
} from "../constants";

export const getAuthCookies = () => {
  if (typeof window === "undefined") return {};

  const accessTokenCookie = cookieCutter.get(ACCESS_TOKEN_COOKIE) as string;
  const expiryTimeCookie = cookieCutter.get(EXPIRY_TIME_COOKIE) as string;
  const refreshTokenCookie = cookieCutter.get(REFRESH_TOKEN_COOKIE) as string;
  const userIdCookie = cookieCutter.get(USER_ID_COOKIE) as string;

  return {
    accessTokenCookie,
    expiryTimeCookie,
    refreshTokenCookie,
    userIdCookie,
  };
};

export const setAuthCookies = ({
  accessToken,
  expiryTime,
  refreshToken,
  userId,
}: {
  accessToken?: string;
  expiryTime?: string;
  refreshToken?: string;
  userId?: string;
}) => {
  accessToken && cookieCutter.set(ACCESS_TOKEN_COOKIE, accessToken);
  expiryTime && cookieCutter.set(EXPIRY_TIME_COOKIE, expiryTime);
  refreshToken && cookieCutter.set(REFRESH_TOKEN_COOKIE, refreshToken);
  userId && cookieCutter.set(USER_ID_COOKIE, userId);
};
