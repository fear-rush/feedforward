import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebaseconfig";

const storeCustomerId = async (userUid, username, email) => {
  await setDoc(doc(db, "user", userUid), {
    id: userUid,
    username: username,
    email: email,
  });
};

export const signUp = async (username, email, password) => {
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
    throw new Error(err.code);
  }
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  signOut(auth);
};
