import { useRouter } from 'next/router'
import React, {useEffect} from 'react'
import { UserAuth } from 'context/AuthContext'

const ProtectedRoute = ({children}) => {
  const {user} = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  return (
    <>{user ? children : <h1>PLease Login</h1>}</>
  )
}

export default ProtectedRoute