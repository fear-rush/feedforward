import "@/styles/globals.css";
import Layout from "components/Layout";
import { AuthContextProvider } from "context/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoute from "components/ProtectedRoute";

const noAuthRoutePages = ["/signin", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <AuthContextProvider>
      <Layout>
        {noAuthRoutePages.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </Layout>
    </AuthContextProvider>
  );
}
