import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ContextProvider } from "../contexts/FavoritesContext";
import { ThemeProvider } from "next-themes";
import ThemeHandler from "@/components/ThemeHandler";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <ThemeHandler />
        <Component {...pageProps} />
      </ThemeProvider>
    </ContextProvider>
  );
}
