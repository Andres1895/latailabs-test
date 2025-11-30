import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ContextProvider } from "../contexts/FavoritesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}
