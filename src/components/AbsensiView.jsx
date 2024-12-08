"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Swal from "sweetalert2";

export default function AbsensiView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Tambahkan state untuk menangani error
  const params = useParams();
  const { userId, id } = params;
  const [nama, setNama] = useState("");
  const [noIdentitas, setNoIdentitas] = useState("");
  const [kehadiran, setKehadiran] = useState("");
  const [token, setToken] = useState("");
  const [loading2, setLoading2] = useState(true);
  const [dataAbsensi, setDataAbsensi] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, `data/${userId}/links`, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data()); // Mengupdate state data dengan data dari Firestore
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching document:", err);
      } finally {
        setLoading(false); // Setelah selesai, ubah loading ke false
      }
    };

    getData();
  }, [userId, id]); // Pastikan dependensi di sini benar

  useEffect(() => {
    if (!userId || !id) return; // Pastikan user dan id ada

    // Mendengarkan perubahan data absensi secara real-time
    const collectionRef = collection(db, `data/${userId}/links/${id}/absensi`);
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
  }, [userId, id]);

  if (loading || loading2) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="font-semibold text-xl p-3 rounded bg-green-300 text-green-700">
          Tunggu Sebentar...
        </h1>
      </div>
    ); // Menampilkan loading saat data sedang diambil
  }

  if (error) {
    return <div>Error: {error}</div>; // Menampilkan error jika terjadi kesalahan
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!nama || !noIdentitas || !kehadiran) {
      Swal.fire("Warning!", "Lengkapi Semua data!", "warning");
      return;
    }

    if (kehadiran === "hadir" && !token) {
      Swal.fire(
        "Warning",
        "Token tidak boleh kosong ketika anda memilih kehadiran hadir!",
        "warning"
      );
      return;
    }

    if (kehadiran === "hadir" && token !== data?.token) {
      Swal.fire("Gagal!", "Token kehadiran salah!", "error");
      return;
    }

    setLoading(true);

    try {
      // Mengecek apakah sudah ada data dengan noIdentitas yang sama
      const absensiRef = collection(db, `data/${userId}/links/${id}/absensi`);
      const q = query(absensiRef, where("noIdentitas", "==", noIdentitas));
      const querySnapshot = await getDocs(q);

      // Jika ditemukan dokumen dengan noIdentitas yang sama, tampilkan peringatan
      if (!querySnapshot.empty) {
        Swal.fire(
          "Gagal!",
          `No Identitas ${noIdentitas} sudah absen!`,
          "error"
        );
        return;
      }

      // Membuat absensi ID yang unik (bisa menggunakan timestamp atau UUID)
      const absensiId = new Date().getTime().toString(); // Menggunakan timestamp sebagai ID unik

      // Menyusun data absensi
      const absensiData = {
        nama,
        noIdentitas,
        kehadiran,
        token: kehadiran === "hadir" ? token : "", // Menyimpan token hanya jika kehadiran "hadir"
        createdAt: Timestamp.fromDate(new Date()),
      };

      // Menyimpan data absensi ke Firestore
      await setDoc(
        doc(db, `data/${userId}/links/${id}/absensi`, absensiId),
        absensiData
      );

      // Reset form
      setToken("");
      setNama("");
      setNoIdentitas("");
      setKehadiran("");

      // Beri tahu user bahwa data telah disimpan
      Swal.fire("Berhasil!", "Data Absensi telah disimpan!", "success");
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menyimpan data: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!data && !loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center px-3">
        <h1 className="font-bold text-3xl p-3 w-max text-center text-red-700 bg-red-300 rounded-sm">
          Absensi Tidak Ditemukan!
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-3 space-y-3">
      <form
        onSubmit={onSubmit}
        className="w-full bg-white p-3 space-y-3 max-w-7xl mx-auto"
      >
        <h1 className="text-center font-bold text-2xl text-blue-500">
          AbseninAja
        </h1>
        <hr />
        <h2 className="text-center font-semibold text-lg">{data?.name}</h2>
        <div className="flex justify-between flex-wrap">
          <h3 className="text-gray-500 text-sm font-semibold">
            Created At :{" "}
            {new Date(data.createdAt.seconds * 1000).toLocaleString()}
          </h3>
          <h3 className="text-gray-500 text-sm font-semibold">
            Closed At :{" "}
            {new Date(data.closedAt.seconds * 1000).toLocaleString()}
          </h3>
        </div>
        {Math.floor(Date.now() / 1000) >= data.closedAt.seconds ? (
          <div className="space-y-3 flex justify-center">
            <h1 className="text-2xl text-center font-bold w-max text-red-700 p-3 rounded-sm bg-red-300">
              Absensi Ini Sudah Di tutup!
            </h1>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="w-full space-y-1">
                <label htmlFor="name" className="font-semibold">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  className="py-2 px-3 rounded border focus:outline-blue-500 w-full"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="w-full space-y-1">
                <label htmlFor="noidentitas" className="font-semibold">
                  No Identitas
                </label>
                <input
                  type="text"
                  required
                  name="noidentitas"
                  className="py-2 px-3 rounded border focus:outline-blue-500 w-full"
                  value={noIdentitas}
                  onChange={(e) => setNoIdentitas(e.target.value)}
                />
              </div>
              <div className="w-full space-y-1">
                <label htmlFor="kehadiran" className="font-semibold">
                  Kehadiran
                </label>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      value={"hadir"}
                      name="kehadiran"
                      className="w-5"
                      checked={kehadiran === "hadir" ? true : false}
                      onChange={(e) => setKehadiran(e.target.value)}
                    />
                    <p className="text-gray-500 text-sm font-semibold">Hadir</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      value={"ijin"}
                      name="kehadiran"
                      className="w-5"
                      checked={kehadiran === "ijin" ? true : false}
                      onChange={(e) => setKehadiran(e.target.value)}
                    />
                    <p className="text-gray-500 text-sm font-semibold">Ijin</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      value={"sakit"}
                      name="kehadiran"
                      className="w-5"
                      checked={kehadiran === "sakit" ? true : false}
                      onChange={(e) => setKehadiran(e.target.value)}
                    />
                    <p className="text-gray-500 text-sm font-semibold">Sakit</p>
                  </div>
                </div>
              </div>
              {kehadiran === "hadir" && (
                <div className="w-full space-y-1">
                  <label htmlFor="token" className="font-semibold">
                    Token Kehadiran
                  </label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    name="token"
                    className="py-2 px-3 rounded border focus:outline-blue-500 w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Masukan token kehadiran yang diberikan pembuat absensi ini!
                  </p>
                </div>
              )}
            </div>
            <button
              disabled={loading}
              className="px-3 py-2 rounded bg-green-300 text-green-700 font-semibold"
            >
              Submit
            </button>
          </>
        )}
      </form>
      <div className="w-full bg-white p-3 space-y-3 max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold">Data Absensi</h3>
        {dataAbsensi.length > 0 ? (
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
                {dataAbsensi.map((absensi, index) => (
                  <tr key={absensi.id}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{absensi.nama || "N/A"}</td>
                    <td className="p-2">*********</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full ${
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
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-center font-semibold text-sm">
            Belum Ada yang mengisi absen!
          </h3>
        )}
      </div>
    </div>
  );
}
