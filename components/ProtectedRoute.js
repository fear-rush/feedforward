import { useRouter } from "next/router";
import { useEffect } from "react";

import { UserAuth } from "context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, userAuthLoading } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !userAuthLoading) {
      router.push("/");
    }
  }, [user?.uid, userAuthLoading]);


  return (
    <>
      {!user && userAuthLoading ? null : user?.uid && !userAuthLoading ? (
        children
      ) : (
        null
      )}
    </>
  );
};

export default ProtectedRoute;
