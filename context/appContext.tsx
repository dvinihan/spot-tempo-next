import { useRouter } from "next/dist/client/router";
import { createContext, useContext } from "react";
import { useMutation, UseMutationResult } from "react-query";
import { login, refresh } from "../mutationFunctions/auth";
import { reloadSavedSongs } from "../mutationFunctions/songs";
import { useSavedSongsCount } from "../queries/songs";
import { getAuthCookies, setAuthCookies } from "../util/cookies";

type ContextProps = {
  loginMutation: UseMutationResult<any, unknown, { code: string }, unknown>;
  refreshMutation: UseMutationResult<
    any,
    unknown,
    { refreshToken: string },
    unknown
  >;
  reloadSavedSongsMutation: UseMutationResult<any, unknown, void, unknown>;
};

export const AppContextProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const savedSongsCountQuery = useSavedSongsCount();
  const { accessTokenCookie } = getAuthCookies();

  const loginMutation = useMutation(login, {
    onSuccess: ({ accessToken, expiryTime, refreshToken }) => {
      setAuthCookies({ accessToken, expiryTime, refreshToken });
      router.push(process.env.NEXT_PUBLIC_BASE_URL as string);
    },
  });

  const refreshMutation = useMutation(refresh, {
    onSuccess: ({ accessToken, expiryTime, refreshToken }) => {
      setAuthCookies({ accessToken, expiryTime, refreshToken });
    },
  });

  const reloadSavedSongsMutation = useMutation(
    () => reloadSavedSongs(accessTokenCookie),
    {
      onSuccess: () => {
        savedSongsCountQuery.refetch();
      },
    }
  );

  return (
    <AppContext.Provider
      value={{
        loginMutation,
        refreshMutation,
        reloadSavedSongsMutation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);
