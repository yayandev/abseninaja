"use client";
import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase"; // Pastikan ini adalah konfigurasi Firebase yang benar
import { getDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import html2pdf from "html2pdf.js"; // Import html2pdf.js

const DetailDataAbsensiView = () => {
  const { user } = useAuth(); // Mendapatkan userID dari context
  const [detail, setDetail] = useState(null);
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const params = useParams();
  const { id } = params; // ID dari URL parameter
  const contentRef = useRef();

  const handleDownloadPDF = () => {
    const content = contentRef.current;

    const options = {
      margin: 1,
      filename: `${detail?.name.toLowerCase()}-${new Date().toString()}.pdf`, // Nama file PDF
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Menggunakan html2pdf.js untuk mencetak seluruh tabel
    html2pdf().from(content).set(options).save();
  };

  useEffect(() => {
    const fetchDetailAbsensi = async () => {
      if (!user || !id) return; // Jika user atau id tidak ada, jangan lanjutkan

      try {
        // Mengambil data detail absensi berdasarkan userID dan ID
        const docRef = doc(db, `data/${user.uid}/links/${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDetail(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailAbsensi();
  }, [user, id]);

  useEffect(() => {
    if (!user || !id) return; // Pastikan user dan id ada

    // Mendengarkan perubahan data absensi secara real-time
    const collectionRef = collection(
      db,
      `data/${user.uid}/links/${id}/absensi`
    );
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const absensiList = [];
        querySnapshot.forEach((doc) => {
          absensiList.push({ ...doc.data(), id: doc.id });
        });

        setDataAbsensi(absensiList);
        setLoading2(false); // Set loading to false setelah data berhasil diambil
      },
      (error) => {
        console.error("Error getting documents:", error);
      }
    );

    // Cleanup ketika komponen di-unmount
    return () => {
      unsubscribe();
    };
  }, [user, id]);

  if (loading || loading2) {
    return (
      <div className="py-2 w-max px-3 rounded bg-green-300 text-green-700 font-bold">
        Tunggu Sebentar...
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 bg-gray-100">
      <div className="flex gap-3">
        <Link
          href={"/data-absensi"}
          className="px-3 py-2 rounded-sm bg-gray-300 text-gray-900 font-bold"
        >
          Kembali
        </Link>
        <button
          onClick={handleDownloadPDF}
          className="px-3 py-2 rounded-sm bg-green-300 text-green-900 font-bold"
        >
          Cetak PDF
        </button>
      </div>
      <div className="space-y-3 w-full" ref={contentRef}>
        <div className="w-full bg-white p-3 rounded">
          <h3 className="font-semibold text-lg">Detail Data Absensi</h3>
          <div className="overflow-x-auto">
            <table className="table-auto">
              <tbody>
                <tr>
                  <th className="text-start p-2">Nama Absensi</th>
                  <th className="text-start p-2">:</th>
                  <th className="text-start p-2">{detail?.name || "N/A"}</th>
                </tr>

                <tr>
                  <th className="text-start p-2">Token Absensi</th>
                  <th className="text-start p-2">:</th>
                  <th className="text-start p-2">{detail?.token || "N/A"}</th>
                </tr>
                <tr>
                  <th className="text-start p-2">Status</th>
                  <th className="text-start p-2">:</th>
                  <th className="text-start p-2">
                    <div
                      className={`w-max px-2 py-1 rounded-full  ${
                        Math.floor(Date.now() / 1000) >=
                        detail?.closedAt.seconds
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {Math.floor(Date.now() / 1000) >= detail?.closedAt.seconds
                        ? "Closed"
                        : "Open"}
                    </div>
                  </th>
                </tr>
                <tr>
                  <th className="text-start p-2">Waktu Buat</th>
                  <th className="text-start p-2">:</th>
                  <th className="text-start p-2">
                    {new Date(
                      detail?.createdAt.seconds * 1000
                    ).toLocaleString() || "N/A"}
                  </th>
                </tr>
                <tr>
                  <th className="text-start p-2">Waktu Tutup</th>
                  <th className="text-start p-2">:</th>
                  <th className="text-start p-2">
                    {new Date(
                      detail?.closedAt.seconds * 1000
                    ).toLocaleString() || "N/A"}
                  </th>
                </tr>
                <tr>
                  <th className="text-start p-2">Link Absensi</th>
                  <th className="text-start p-2">:</th>
                  <th className="text-start p-2">
                    <Link
                      className="text-sm text-blue-500"
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}/links/${detail?.userId}/${detail?.id}`}
                    >
                      {process.env.NEXT_PUBLIC_BASE_URL}/links/{detail?.userId}/
                      {detail?.id}
                    </Link>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full bg-white p-3 rounded space-y-3">
          <h3 className="text-lg font-semibold">Data Absensi</h3>
          <div className="overflow-x-auto bg-white rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">No Identitas</th>
                  <th className="py-3 px-4 text-left">Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {dataAbsensi?.map((absensi, index) => (
                  <tr key={absensi.id}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{absensi.nama || "N/A"}</td>
                    <td className="p-2">{absensi.noIdentitas || "N/A"}</td>
                    <td className="p-2 flex items-center">
                      <div
                        className={`px-2 py-1 rounded-full flex items-center justify-center w-max ${
                          absensi.kehadiran === "hadir"
                            ? "bg-green-200 text-green-800" // Hadir
                            : absensi.kehadiran === "ijin"
                            ? "bg-yellow-200 text-yellow-800" // Ijin
                            : absensi.kehadiran === "sakit"
                            ? "bg-red-200 text-red-800" // Sakit
                            : "bg-gray-200 text-gray-800" // Default jika tidak ada status
                        }`}
                      >
                        {absensi.kehadiran === "hadir"
                          ? "Hadir"
                          : absensi.kehadiran === "ijin"
                          ? "Ijin"
                          : absensi.kehadiran === "sakit"
                          ? "Sakit"
                          : "Tidak Diketahui"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDataAbsensiView;
