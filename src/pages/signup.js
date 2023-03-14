import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { db } from "utils/firebaseconfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { UserAuth } from "context/AuthContext";
import { useRouter } from "next/router";

const SignUpPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, signUp, signIn } = UserAuth();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm();

  const submitHandler = async (data) => {
    try {
      //signup with username, email, password
      signUp(data.username, data.email, data.password);
      setIsSuccess(true);
      // provide error handling with popup when signup fail
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>SIGN UP</h1>
      <div>
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
          <div className="mt-4">
            <input
              type="text"
              {...register("username", {
                required: "Please enter a valid username",
              })}
              className="border-2 border-red-500"
              placeholder="Username"
            ></input>
            {errors.username && (
              <div className="text-red-500">{errors.username.message}</div>
            )}
          </div>

          <div className="mt-4">
            <input
              type="email"
              {...register("email", {
                required: "Please enter a valid email",
              })}
              className="border-2 border-red-500"
              placeholder="Email"
            ></input>
            {errors.email && (
              <div className="text-red-500">{errors.username.email}</div>
            )}
          </div>

          <div className="mt-4">
            <input
              type="password"
              {...register("password", {
                required: "Please enter a valid password",
              })}
              className="border-2 border-red-500"
              placeholder="Password"
            ></input>
            {errors.password && (
              <div className="text-red-500">{errors.password.email}</div>
            )}
          </div>
          <button className="bg-blue-500 border-2 border-red-500">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-yellow-500 cursor-pointer">
          <Link href="/signin">Sign In</Link>
        </p>
      </div>
    </>
  );
};

export default SignUpPage;
