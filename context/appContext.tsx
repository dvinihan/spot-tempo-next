import { createContext, useContext, useState } from "react";

type ContextProps = {
  bpm: number | undefined;
  setBpm: (bpm: number) => void;
};

export const AppContextProvider = ({ children }: { children: any }) => {
  const [bpm, setBpm] = useState<number | undefined>();

  return (
    <AppContext.Provider value={{ bpm, setBpm }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);
