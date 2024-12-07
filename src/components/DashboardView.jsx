"use client";

import { useAbsensi } from "@/context/AbsensiContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const DashboardView = () => {
  const { user } = useAuth();
  const { links } = useAbsensi();
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="space-y-3">
        <img
          src="/dashboard-ilustrasi.png"
          className="w-64"
          alt="Ilustrasi Dashboard"
        />
        <h3 className="text-lg">
          Selamat Datang, <span className="font-bold">{user?.displayName}</span>{" "}
          Di <span className="text-blue-500 font-bold">AbseninAja</span>
        </h3>
        <p className="text-gray-500">
          Manajemen absensi yang mudah dan praktis.
        </p>
      </div>

      {/* Statistik Absensi */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h4 className="text-xl font-semibold">Statistik</h4>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Jumlah Link Absensi</p>
            <p className="text-3xl font-bold">{links?.length}</p>
            {links?.length == 0 && (
              <p className="text-xs text-gray-500 italic">
                Ayo buat link absensi pertama anda!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Navigasi */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
        <h4 className="text-xl font-semibold">Akses Cepat</h4>
        <div className="flex space-x-4">
          <Link
            href={"/data-absensi"}
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Lihat Link Absensi
          </Link>
          <Link
            href={"/create-link-absensi"}
            className="inline-block bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Buat Link Absensi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
