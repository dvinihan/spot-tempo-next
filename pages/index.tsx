import { QueryClient, QueryClientProvider } from "react-query";
import App from "../components/App";
import { AppContextProvider } from "../context/appContext";

const AppWrapper = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  );
};

export default AppWrapper;
