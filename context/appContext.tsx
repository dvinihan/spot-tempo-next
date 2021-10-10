import { useRouter } from "next/dist/client/router";
import { createContext, useContext } from "react";
import { useMutation, UseMutationResult } from "react-query";
import { login, refresh } from "../mutationFunctions/auth";
import {
  getMatchingSongs,
  getSavedSongsCount,
  reloadSavedSongs,
} from "../mutationFunctions/songs";
import { getAuthCookies, setAuthCookies } from "../util/cookies";

type ContextProps = {
  matchingSongsMutation: UseMutationResult<
    any,
    unknown,
    { bpm: string },
    unknown
  >;
  savedSongsCountMutation: UseMutationResult<any, unknown, void, unknown>;
  reloadSavedSongsMutation: UseMutationResult<any, unknown, void, unknown>;
  loginMutation: UseMutationResult<any, unknown, { code: string }, unknown>;
  refreshMutation: UseMutationResult<
    any,
    unknown,
    { refreshToken: string },
    unknown
  >;
};

export const AppContextProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const { accessTokenCookie } = getAuthCookies();

  const matchingSongsMutation = useMutation(({ bpm }: { bpm: string }) =>
    getMatchingSongs({ bpm, accessTokenCookie })
  );

  const savedSongsCountMutation = useMutation(() =>
    getSavedSongsCount({ accessTokenCookie })
  );

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
    () => reloadSavedSongs({ accessTokenCookie }),
    {
      onSuccess: () => {
        savedSongsCountMutation.mutate();
      },
    }
  );

  return (
    <AppContext.Provider
      value={{
        matchingSongsMutation,
        savedSongsCountMutation,
        reloadSavedSongsMutation,
        loginMutation,
        refreshMutation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);
