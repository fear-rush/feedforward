import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthContextProvider } from "context/AuthContext";
import { LocationContextProvider } from "../../context/LocationContext";

import ProtectedRoute from "components/ProtectedRoute";
import Layout from "components/Layout";

import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

const noAuthRoutePages = ["/signin", "/signup"];

const OneFourHoursInMs = 1000 * 60 * 60 * 1;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: OneFourHoursInMs,
    },
  },
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <main className={`${roboto.variable} font-sans`}>
        <AuthContextProvider>
          <LocationContextProvider>
            <Layout>
              {noAuthRoutePages.includes(router.pathname) ? (
                <>
                  <Component {...pageProps} />
                </>
              ) : (
                <ProtectedRoute>
                  <Component {...pageProps} />
                </ProtectedRoute>
              )}
            </Layout>
          </LocationContextProvider>
        </AuthContextProvider>
      </main>
      <ReactQueryDevtools initialIsOpen={true} />

    </QueryClientProvider>
  );
  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <main className={`${roboto.variable} font-sans`}>
  //       <AuthContextProvider>
  //         <LocationContextProvider>
  //           <Layout>
  //             <Component {...pageProps} />
  //           </Layout>
  //         </LocationContextProvider>
  //       </AuthContextProvider>
  //     </main>
  //   </QueryClientProvider>
  // );
}
