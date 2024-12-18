import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { BeatLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { signIn } from "../../utils/firebaseauth";
import { db } from "utils/firebaseconfig";

import splitframe from "../../public/signin/frame2.png";

import "react-toastify/dist/ReactToastify.css";

const override = {
  borderColor: "blue",
  marginTop: "1rem",
  marginBottom: "1rem",
  textAlign: "center",
};

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const loginData = await signIn(data.email, data.password);
      const userDocRef = doc(db, "user", loginData.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        router.replace("/home");
        setLoading(false);
      }
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        toast.error("Invalid email/password");
      } else if (err.code === "auth/user-not-found") {
        toast.error("Invalid email/password");
      } else {
        toast.error(`An error occured. Error: ${err.code}`);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="hidden lg:block"
      />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="lg:hidden"
      />
      <div className="mt-14 items-center justify-between lg:flex">
        <div className="hidden min-w-[600px] lg:block">
          <Image
            src={splitframe}
            alt="Split screen frame"
            width={600}
            height={600}
          />
        </div>
        <div className="mx-auto lg:py-12">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-extrabold lg:pl-9 lg:text-left">
              Halaman Masuk
            </h1>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit(submitHandler)}
            className="mx-auto max-w-screen-md px-9"
          >
            <div className="mb-6">
              <label htmlFor="email" className="font-medium block">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Please enter your email",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  },
                })}
                className="form-field mt-1 p-2 text-gray-500"
                id="email"
                autoFocus
                placeholder="you@example.com"
              ></input>
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>
            <div className="mb-8">
              <label htmlFor="password" className="font-medium block">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Please enter your password",
                })}
                className="form-field mt-1 p-2 text-gray-500"
                id="password"
                placeholder="Password"
              ></input>
              {errors.password && (
                <div className="text-red-500">{errors.password.message}</div>
              )}
            </div>
            {loading ? (
              <BeatLoader
                color="#000"
                loading={loading}
                cssOverride={override}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <button className="secondary-button block px-5 py-2.5 mx-auto mb-4">
                Masuk
              </button>
            )}
            <div className="text-center">
              <p>Belum punya akun?</p>
              <Link href="/signup">
                <p className="font-medium w-fit mx-auto">Daftar</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
