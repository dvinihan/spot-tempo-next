import { createContext, useContext, useState } from "react";

type ContextProps = {
  bpm: string;
  setBpm: (bpm: string) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;
};

export const AppContextProvider = ({ children }: { children: any }) => {
  const [bpm, setBpm] = useState<string>("");
  const [loadingText, setLoadingText] = useState<string>("");

  return (
    <AppContext.Provider value={{ bpm, setBpm, loadingText, setLoadingText }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);
