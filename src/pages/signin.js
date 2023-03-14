import React from "react";
import { useForm } from "react-hook-form";
import { UserAuth } from "context/AuthContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "utils/firebaseconfig";
import { useRouter } from "next/router";
import Link from "next/link";

const SignInPage = () => {
  const { user, signIn } = UserAuth();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const loginData = await signIn(data.email, data.password);
      const userDocRef = doc(db, "user", loginData.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // add react loader
      if (userDocSnap.exists()) {
        router.push("/");
      } else {
        // add popup on wrong username/password
        router.push("/signin");
      }
    } catch (err) {
      // add react popup on error
      console.log(err);
    }
  };

  return (
    <>
      <div>SignInPage</div>
      <div className="mt-6">
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
          <div className="mt-6">
            <input
              type="email"
              {...register("email", {
                required: "Please enter your email",
              })}
              className="border-2 border-red-500"
              id="email"
              autoFocus
              placeholder="Email"
            ></input>
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
            <input
              type="password"
              {...register("password", {
                required: "Please enter your password",
              })}
              className="border-2 border-red-500"
              id="password"
              placeholder="Password"
            ></input>
            {errors.email && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>
          <button className="bg-blue-500 border-2 border-red-500">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-yellow-500 cursor-pointer">
          <Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </>
  );
};

export default SignInPage;
