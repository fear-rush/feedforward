import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContextProvider } from "context/AuthContext";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "components/ProtectedRoute";
import Layout from "components/Layout";
import { onMessageListener } from "../../utils/firebaseconfig";

import "@/styles/globals.css";

onMessageListener().then((payload) => {
  toast.info(
    <div>
      {payload.notification.title} <br /> {payload.notification.body}
    </div>
  );
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

const noAuthRoutePages = ["/signin", "/signup", "/"];

const OneHoursInMs = 1000 * 60 * 60 * 1;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: true,
      retry: false,
      staleTime: OneHoursInMs,
    },
  },
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <main className={`${roboto.variable} font-sans`}>
        <AuthContextProvider>
          <Layout>
            {noAuthRoutePages.includes(router.pathname) ? (
              <>
                <Component {...pageProps} />
              </>
            ) : (
              <ProtectedRoute>
                <ToastContainer />
                <Component {...pageProps} />
              </ProtectedRoute>
            )}
          </Layout>
        </AuthContextProvider>
      </main>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
}
