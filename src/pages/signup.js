import { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

import { signUp } from "../../utils/firebaseauth";

import "react-toastify/dist/ReactToastify.css";
import splitframe from "../../public/signin/frame2.png";

const override = {
  borderColor: "blue",
  marginTop: "1rem",
  marginBottom: "1rem",
  textAlign: "center",
};

const SignUpPage = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      //signup with username, email, password
      await signUp(data.username, data.email, data.password);
      setLoading(false);
      router.replace("/home");
    } catch (err) {
      if (err.message === "auth/email-already-in-use") {
        toast.error("Email already taken");
      } else {
        toast.error(`An error occured. Error: ${err.message}`);
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
        <div className="m-auto">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-extrabold lg:pl-9 lg:text-left">
              Halaman Daftar
            </h1>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit(submitHandler)}
            className="mx-auto max-w-screen-md px-9"
          >
            <div className="mb-6">
              <label htmlFor="username" className="font-medium block">
                Username
              </label>
              <input
                type="text"
                {...register("username", {
                  required: "Please enter a valid username",
                })}
                className="form-field mt-1 p-2 text-gray-500"
                placeholder="Username"
              ></input>
              {errors.username && (
                <div className="text-red-500">{errors.username.message}</div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="font-medium block">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Please enter a valid email",
                })}
                className="form-field mt-1 p-2 text-gray-500"
                placeholder="Email"
              ></input>
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="font-medium block">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Please enter a valid password",
                  minLength: {
                    value: 6,
                    message: "Password at least 6 characters",
                  },
                })}
                className="form-field mt-1 p-2 text-gray-500"
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
                Daftar
              </button>
            )}
            <div className="text-center">
              <p>Sudah punya akun? </p>
              <Link href="/signin">
                <p className="font-medium w-fit mx-auto">Masuk</p>
              </Link>
            </div>
          </form>
        </div>
      </div>

    
    </>
  );
};

export default SignUpPage;
