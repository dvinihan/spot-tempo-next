import { useState } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  const [hasDoneFirstSongLoad, setHasDoneFirstSongLoad] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Component
        {...pageProps}
        hasDoneFirstSongLoad={hasDoneFirstSongLoad}
        setHasDoneFirstSongLoad={setHasDoneFirstSongLoad}
      />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
export default MyApp;
