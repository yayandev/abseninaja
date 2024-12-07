"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user, isAuthenticated, loginWithGoogle, loading, signout } =
    useAuth();

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="space-y-3 px-3 md:px-0 text-center">
        <div className="flex justify-center">
          <img src="/welcome-ilustrasi.png" className="w-[250px]" alt="" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-500">
          AbseninAja
        </h1>
        <h3 className="font-semibold text-lg md:text-xl">
          Solusi Absensi Online yang Tepat dan Efisien!
        </h3>
        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex gap-3 justify-center p-2 rounded bg-white">
              <Image
                height={40}
                width={40}
                src={user?.photoURL}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
                alt=""
              />
              <p className="text-lg font-semibold">{user?.displayName}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link
                href={"/dashboard"}
                className="px-4 py-2 inline-block rounded bg-blue-500 text-white font-semibold text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={signout}
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold text-sm"
              >
                Keluar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              disabled={loading}
              onClick={loginWithGoogle}
              className="px-4 py-2 rounded bg-gray-400 text-white font-semibold"
            >
              {loading ? (
                "Tunggu Sebentar..."
              ) : (
                <>
                  Masuk Dengan <span className="text-blue-500">G</span>
                  <span className="text-lg">
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </span>
                </>
              )}
            </button>
          </div>
        )}
        <p className="text-gray-400 text-xs">
          Copyright © <a href="https://yayandev.com">yayandev.com</a> 2024
        </p>
      </div>
    </div>
  );
}
