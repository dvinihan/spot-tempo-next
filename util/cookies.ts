import cookieCutter from "cookie-cutter";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRY_TIME_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../constants";

export const getAuthCookies = () => {
  if (typeof window === "undefined") return {};

  return {
    accessTokenCookie: cookieCutter.get(ACCESS_TOKEN_COOKIE) as string,
    expiryTimeCookie: cookieCutter.get(EXPIRY_TIME_COOKIE) as string,
    refreshTokenCookie: cookieCutter.get(REFRESH_TOKEN_COOKIE) as string,
  };
};

export const setAuthCookies = ({
  accessToken,
  expiryTime,
  refreshToken,
}: {
  accessToken?: string;
  expiryTime?: string;
  refreshToken?: string;
}) => {
  accessToken && cookieCutter.set(ACCESS_TOKEN_COOKIE, accessToken);
  expiryTime && cookieCutter.set(EXPIRY_TIME_COOKIE, expiryTime);
  refreshToken && cookieCutter.set(REFRESH_TOKEN_COOKIE, refreshToken);
};

export const getIsAccessTokenExpired = (expiryTimeCookie?: string) => {
  return expiryTimeCookie ? Date.now() > parseInt(expiryTimeCookie) : true;
};
