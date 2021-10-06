import React, { createContext, useContext, useState } from "react";

type ContextProps = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  bpm: number | undefined;
  setBpm: (bpm: number) => void;
};

export const AppContextProvider = ({ children }: { children: any }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [bpm, setBpm] = useState<number | undefined>();

  return (
    <AppContext.Provider
      value={{ accessToken, setAccessToken, userId, setUserId, bpm, setBpm }}
    >
      {children}
    </AppContext.Provider>
  );
};

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);
