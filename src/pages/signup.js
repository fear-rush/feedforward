import React, { useState, Fragment } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserAuth } from "context/AuthContext";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import { Transition, Dialog } from "@headlessui/react";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

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
  const { user, signUp, signIn } = UserAuth();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      //signup with username, email, password
      await signUp(data.username, data.email, data.password);
      setIsOpen(true);
      setLoading(false);
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
              Sign Up
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
                Sign Up
              </button>
            )}
            {/* <button className="secondary-button block px-5 py-2.5 mx-auto mb-4">
              Sign Up
            </button> */}
            <div className="text-center">
              <p>Already have an account? </p>
              <Link href="/signin">
                <p className="font-medium w-fit mx-auto">Sign in</p>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Account succesfully created
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your account has been successfully created. Please
                      redirect to sign in page and sign in with credentials that
                      you've been submitted.
                    </p>
                  </div>

                  <div className="flex mt-4 gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-center my-auto"
                      onClick={() => {
                        router.replace("/signin")
                      }}
                    >
                      Go to sign in page
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 text-center my-auto"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SignUpPage;
