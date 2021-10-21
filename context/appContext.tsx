import { useRouter } from "next/dist/client/router";
import { createContext, useContext, useState } from "react";
import { useMutation, UseMutationResult } from "react-query";
import { login, refreshAuth } from "../mutationFunctions/auth";
import { reloadFromSpotify } from "../mutationFunctions/songs";
import { getAuthCookies, setAuthCookies } from "../util/cookies";

type ContextProps = {
  reloadFromSpotifyMutation: UseMutationResult<any, unknown, void, unknown>;
  loginMutation: UseMutationResult<any, unknown, { code: string }, unknown>;
  refreshAuthMutation: UseMutationResult<
    any,
    unknown,
    { refreshToken: string },
    unknown
  >;
  isNavDrawerOpen: boolean;
  setIsNavDrawerOpen: (isOpen: boolean) => void;
};

export const AppContextProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const { accessTokenCookie } = getAuthCookies();

  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const loginMutation = useMutation(login, {
    onSuccess: ({ accessToken, expiryTime, refreshToken }) => {
      setAuthCookies({ accessToken, expiryTime, refreshToken });
      router.push(process.env.NEXT_PUBLIC_BASE_URL as string);
    },
  });

  const refreshAuthMutation = useMutation(refreshAuth, {
    onSuccess: ({ accessToken, expiryTime, refreshToken }) => {
      setAuthCookies({ accessToken, expiryTime, refreshToken });
    },
  });

  const reloadFromSpotifyMutation = useMutation(
    () => reloadFromSpotify({ accessTokenCookie })
    // {
    //   onSuccess: () => {
    //     savedSongsCountMutation.mutate();
    //   },
    // }
  );

  return (
    <AppContext.Provider
      value={{
        reloadFromSpotifyMutation,
        loginMutation,
        refreshAuthMutation,
        isNavDrawerOpen,
        setIsNavDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);
