import Link from "next/link";
import { UserAuth } from "context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import hero from "../../public/hero.png";

export default function Home() {
  const { user } = UserAuth();
  return (
    <>
      <section className="bg-gradient-to-r from-green-200 via-green-400 to-green-500 px-4 lg:px-0">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Giving and Receiving Goodness
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-700 lg:mb-8 md:text-lg lg:text-xl">
              Peduli lingkungan dan peduli sesama dengan berbagi makanan
            </p>

            <Link href={user ? "/home" : "/signin"}>
              <button className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-black rounded-lg bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300">
                Mulai Berbagi
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </Link>
          </div>
          <div className="hidden relative lg:mt-0 lg:col-span-5 lg:flex">
            <Image src={hero} alt="Hero PNG From Freepik" />
          </div>
        </div>
      </section>

      <section className="mx-auto py-16 bg-white overflow-hidden">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="max-w-xl text-center mx-auto mb-20">
            <h1 className="mb-5 text-5xl lg:text-6xl tracking-tighter font-semibold">
              Cara Kerja FeedForward
            </h1>
            <p className="text-xl tracking-tight font-light">
              Dengan FeedForward anda bisa memberi dan menerima makanan. Pemberi
              adalah pihak pemberi makanan dan penerima adalah pihak penerima
              makanan
            </p>
          </div>
          <div className="flex flex-wrap -m-7 mb-14">
            <div className="w-full md:w-1/3 p-7">
              <div className="max-w-xs">
                <GiftIcon className="w-12 h-12 mb-4" />
                <h3 className="mb-4 text-xl font-semibold tracking-tight">
                  Bagi makanan
                </h3>
                <p className="text-gray-600 tracking-tight">
                  Pemberi membagikan makanan dengan mengisi keterangan makanan
                  yang akan dibagikan. Setiap membagi makanan akan mendapatkan
                  poin
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-7">
              <div className="max-w-xs">
                <ArchiveBoxIcon className="w-12 h-12 mb-4" />
                <h3 class="mb-4 text-xl font-semibold tracking-tight">
                  Penerima mengambil makanan
                </h3>
                <p className="text-gray-600 tracking-tight">
                  Makanan yang dibagi oleh pembagi otomatis akan ditampilkan
                  kepada penerima dengan jarak terdekat. Ketika penerima
                  mengambil makanan, pemberi mendapatkan notifikasi pengambilan
                  makanan
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-7">
              <div className="max-w-xs">
                <CheckCircleIcon className="w-12 h-12 mb-4" />
                <h3 class="mb-4 text-xl font-semibold tracking-tight">
                  Konfirmasi pengambilan makanan
                </h3>
                <p className="text-gray-600 tracking-tight">
                  Setelah penerima selesai mengambil makanan. Penerima
                  mengonfirmasi pengambilan makanan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
