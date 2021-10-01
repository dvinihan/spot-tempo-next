import React, { createContext, useContext, useState } from "react";

type ContextProps = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
};

export const AppContextProvider = ({ children }: { children: any }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  return (
    <AppContext.Provider
      value={{ accessToken, setAccessToken, userId, setUserId }}
    >
      {children}
    </AppContext.Provider>
  );
};

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);
