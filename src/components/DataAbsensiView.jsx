"use client";

import { useAbsensi } from "@/context/AbsensiContext";
import Link from "next/link";
import Swal from "sweetalert2";

const DataAbsensiView = () => {
  const { links, close, trash } = useAbsensi();

  return (
    <div className="container mx-auto px-4 py-6 space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Daftar Absensi
        </h1>
        <Link
          href={"/create-link-absensi"}
          className="inline-block px-3 py-2 rounded-sm text-sm bg-green-300 text-green-900 hover:bg-green-500 hover:text-white"
        >
          Buat Link Absensi
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">Tanggal Buat</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Tanggal Tutup</th>
              <th className="py-3 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {links?.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 text-sm">{index + 1}</td>
                <td className="py-3 px-4 text-sm">{item.name}</td>
                <td className="py-3 px-4 text-sm">
                  {new Date(item.createdAt.seconds * 1000).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      Math.floor(Date.now() / 1000) >= item.closedAt.seconds
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {Math.floor(Date.now() / 1000) >= item.closedAt.seconds
                      ? "Closed"
                      : "Open"}
                  </span>
                </td>

                <td className="py-3 px-4 text-sm">
                  {new Date(item.closedAt.seconds * 1000).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/links/${item?.userId}/${item?.id}`
                      );
                      Swal.fire(
                        "Berhasil!",
                        "Link Berhasil Di copy!",
                        "success"
                      );
                    }}
                    className="text-green-500 hover:text-green-700"
                  >
                    Share
                  </button>
                  <Link
                    href={`/data-absensi/${item?.id}`}
                    className="inline-block text-blue-500 hover:text-blue-700"
                  >
                    Detail
                  </Link>
                  {Math.floor(Date.now() / 1000) < item.closedAt.seconds && (
                    <button
                      onClick={() => close(item?.id)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => trash(item?.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataAbsensiView;
