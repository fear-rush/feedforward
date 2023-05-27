import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { UserAuth } from "context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, userAuthLoading } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !userAuthLoading) {
      router.push("/");
    }
  }, [user, userAuthLoading]);

  // return <>{user?.uid && !userAuthLoading ? children : <h1>PLease Login</h1>}</>;

  return (
    <>
      {!user && userAuthLoading ? null : user?.uid && !userAuthLoading ? (
        children
      ) : (
        <h1>Please Login</h1>
      )}
    </>
  );
};

export default ProtectedRoute;
