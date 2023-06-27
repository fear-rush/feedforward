import React, { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";

import { UserAuth } from "../context/AuthContext";
import { logOut } from "../utils/firebaseauth";

import mobilelogo from "../public/header/mobilelogo.png";
import desktoplogo from "../public/header/desktoplogo.png";

function Layout({ children }) {
  const { user, userAuthLoading } = UserAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <>
      <Head>
        <title>Feed Forward</title>
        <meta name="description" content="Food Sharing Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="w-full">
        <nav className="mt-1 flex h-20 w-full items-center justify-between px-6 shadow-md sm:px-12 lg:h-16 lg:px-16">
          <div className="hidden cursor-pointer md:flex md:items-center md:gap-x-2">
            <Link href={user ? "/home" : "/"}>
              <Image
                src={desktoplogo}
                width={35}
                height={35}
                style={{ width: "auto", height: "auto" }}
                priority={true}
                alt="FeedForward Logo"
              />
            </Link>
            <p className="font-bold text-lg">FeedForward</p>
          </div>

          <div className="flex items-center gap-x-2 cursor-pointer md:hidden">
            <Link href="/">
              <Image
                src={mobilelogo}
                width={35}
                height={35}
                priority={true}
                alt="FeedForward Logo"
              />
            </Link>
            <p className="font-bold text-lg">FeedForward</p>
          </div>

          {!user && userAuthLoading ? null : user && !userAuthLoading ? (
            <Menu as="div" className="inline-block text-left">
              <div className="items-center justify-center gap-4 lg:flex">
                <div className="hidden lg:block">
                  <p className="w-40 cursor-default text-center text-sm font-medium text-gray-700">
                    {user.displayName}
                  </p>
                </div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  <Bars3Icon className="text-black h-7 w-7" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                className="w-full"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transfrom opacity-100 scale-100"
                leaveTo="transform opacity-0 scale095"
              >
                <Menu.Items className="absolute right-0 top-[4.5rem] z-50 mt-2 w-full origin-top rounded-b-xl bg-white text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none lg:w-40 lg:right-16 lg:top-[3.8rem]">
                  <div className="py-3">
                    <Menu.Item as="div" className="lg:hidden">
                      <a
                        href="#"
                        className="mt-2 block px-4 py-2 text-sm font-medium text-gray-700"
                      >
                        {user.displayName}
                      </a>
                    </Menu.Item>
                    {router.asPath.includes("/home") ||
                    router.asPath.includes("/profile") ? null : (
                      <Menu.Item as="div" className="hover:bg-gray-100">
                        <div>
                          <p
                            className="block px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer"
                            onClick={() => {
                              queryClient.removeQueries();
                              router.push("/home");
                            }}
                          >
                            Home
                          </p>
                        </div>
                      </Menu.Item>
                    )}
                    <Menu.Item as="div" className="hover:bg-gray-100">
                      <div>
                        <p
                          className="block px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer"
                          onClick={() => {
                            queryClient.removeQueries();
                            logOut();
                            router.replace("/signin");
                          }}
                        >
                          Keluar
                        </p>
                      </div>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : router.asPath.includes("/signin") ||
            router.asPath.includes("/signup") ? null : (
            <div>
              <Menu as="div" className="inline-block text-left lg:hidden">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                    <Bars3Icon className="text-black h-7 w-7" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transitione ease-out duration-100"
                  enterFrom="transtiion opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transtion ease-in duration-75"
                  leaveFrom="transform opacity-100 sclae-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 top-[4.5rem] z-50 mt-2 w-full origin-top rounded-b-xl bg-white text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-4">
                    <Menu.Item>
                      <div>
                        <button
                          onClick={() => router.replace("/signin")}
                          className="secondary-button w-24 px-4 py-3 mb-3"
                        >
                          Masuk
                        </button>
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => router.replace("/signup")}
                        className="primary-button w-24 px-4 py-3"
                      >
                        Daftar
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
              <div className="hidden w-52 items-center justify-between  lg:flex lg:gap-6">
                <button
                  onClick={() => router.replace("/signin")}
                  className="secondary-button w-32 px-4 py-3"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.replace("/signup")}
                  className="primary-button w-32 px-4 py-3"
                >
                  Daftar
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {router.asPath.includes("/home") ||
      router.asPath.includes("/profile") ||
      router.asPath.includes("/signin") ||
      router.asPath.includes("/signup") ? (
        <main className="container mx-auto mb-36 mt-4 min-h-screen max-w-screen-lg lg:px-4 lg:mb-48">
          {children}
        </main>
      ) : (
        <main>{children}</main>
      )}
    </>
  );
}

export default Layout;
