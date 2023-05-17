import "@/styles/globals.css";
import Layout from "components/Layout";
import { AuthContextProvider } from "context/AuthContext";
import { LocationContextProvider } from "../../context/LocationContext";
import { useRouter } from "next/router";
import ProtectedRoute from "components/ProtectedRoute";
// import { Roboto } from "next/font/google";
import { Roboto } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";

import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

const noAuthRoutePages = ["/signin", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <main className={`${roboto.variable} font-sans`}>
      <AuthContextProvider>
        <LocationContextProvider>
          <Layout>
            {noAuthRoutePages.includes(router.pathname) ? (
              <Component {...pageProps} />
            ) : (
              <ProtectedRoute>
                <Component {...pageProps} />
              </ProtectedRoute>
            )}
          </Layout>
        </LocationContextProvider>
      </AuthContextProvider>
    </main>
  );
}
