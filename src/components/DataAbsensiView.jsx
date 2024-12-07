"use client";

import { useAbsensi } from "@/context/AbsensiContext";
import Link from "next/link";

const DataAbsensiView = () => {
  const { links, close } = useAbsensi();
  console.log(links);

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
            {links.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 text-sm">{index + 1}</td>
                <td className="py-3 px-4 text-sm">{item.name}</td>
                <td className="py-3 px-4 text-sm">
                  {new Date(item.createdAt.seconds * 1000).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      item.status === "Open"
                        ? "bg-green-200 text-green-800"
                        : item.status === "Close"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  {new Date(item.closedAt.seconds * 1000).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    Detail
                  </button>
                  <button
                    onClick={() => close(item?.id)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Close
                  </button>
                  <button className="text-red-500 hover:text-red-700">
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
