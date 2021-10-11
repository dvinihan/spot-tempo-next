import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  if ("serviceWorker" in navigator) {
    // register service worker
    navigator.serviceWorker.register("service-worker.js");
  }

  return <Component {...pageProps} />;
}
export default MyApp;
