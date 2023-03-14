import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "utils/firebaseconfig";

const UserContext = createContext();

const storeCustomerId = async (userUid, username, email) => {
  await setDoc(doc(db, "user", userUid), {
    id: userUid,
    username: username,
    email: email,
  });
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const signUp = async (username, email, password) => {
    try {
      const registeredUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, { displayName: username }).catch(
        (err) => {
          console.log(err);
        }
      );
      console.log(registeredUser);
      storeCustomerId(registeredUser.user.uid, username, email);
    } catch (err) {
      console.log(err);
    }
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (curentUser) => {
      setUser(curentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ signUp, user, logOut, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};