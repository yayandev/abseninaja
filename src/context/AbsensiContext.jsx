"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const generateToken = () => {
  return uuidv4(); // Menghasilkan token unik menggunakan UUID v4
};

const AbsensiContext = createContext({
  loading: true,
  links: [],
  add: () => {},
  close: () => {},
  open: () => {},
  trash: () => {},
  edit: () => {},
});

export const useAbsensi = () => {
  return useContext(AbsensiContext);
};

export const AbsensiProvider = ({ children }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLinks([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, `data/${user?.uid}/links`));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let datas = [];
        querySnapshot.forEach((doc) => {
          datas.push(doc.data()); // Ambil data dari dokumen
        });
        setLinks(datas);
        setLoading(false); // Set loading ke false setelah data dimuat
      },
      (error) => {
        console.error("Error getting documents: ", error);
        setLoading(false); // Tetap set loading ke false jika error
      }
    );

    return unsubscribe;
  }, [user]);

  const add = async (name, closedAt) => {
    setLoading(true);
    try {
      const token = generateToken();
      let id = `${user?.uid}_${Date.now()}`;
      // Persiapkan data yang akan disimpan ke Firestore
      const newItem = {
        name,
        createdAt: serverTimestamp(), // Mengonversi string tanggal ke Timestamp
        closedAt: Timestamp.fromDate(new Date(closedAt)), // Mengonversi string tanggal ke Timestamp
        status: "Open",
        token,
        userId: user?.uid, // Menyimpan ID pengguna yang terkait
        id,
      };

      // Tentukan document ID berdasarkan userid (atau bisa menggunakan auto ID jika perlu)
      const docRef = doc(db, `data/${user?.uid}/links`, id); // Membuat ID unik berdasarkan userid dan timestamp

      // Simpan data ke Firestore
      await setDoc(docRef, newItem);
      router.push("/data-absensi");
      Swal.fire("Berhasil!", "Data berhasil ditambahkan!", "success");
    } catch (error) {
      Swal.fire("Gagal!", "Error menambahkan data: " + error, "error");
    } finally {
      setLoading(false);
    }
  };
  const close = async (id) => {
    // Menampilkan konfirmasi sebelum menutup link
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Setelah link ditutup, Link tidak bisa digunakan lagi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, tutup!",
      cancelButtonText: "Batal",
      reverseButtons: true, // Menyusun tombol konfirmasi di kanan, batal di kiri
    });

    // Jika pengguna memilih "Ya, tutup!", lanjutkan dengan proses penutupan
    if (result.isConfirmed) {
      try {
        Swal.showLoading(); // Menampilkan loading
        // Mendapatkan referensi dokumen berdasarkan id
        const docRef = doc(db, `data/${user?.uid}/links`, id);
        const now = new Date();
        const seconds = Math.floor(now.getTime() / 1000); // Waktu dalam detik
        const nanoseconds = now.getMilliseconds() * 1000000;
        // Memperbarui field status menjadi 'Close' dan menambahkan timestamp untuk 'closedAt'
        await updateDoc(docRef, {
          status: "Close",
          closedAt: { seconds, nanoseconds }, // Set timestamp untuk 'closedAt'
        });

        // Menampilkan notifikasi berhasil
        Swal.fire("Berhasil!", "Link berhasil ditutup!", "success");
      } catch (error) {
        // Menampilkan error jika gagal
        Swal.fire("Gagal!", "Error mengupdate data: " + error.message, "error");
      }
    }
  };
  const open = async (id) => {};
  const trash = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Setelah link dihapus, Link tidak bisa digunakan lagi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, tutup!",
      cancelButtonText: "Batal",
      reverseButtons: true, // Menyusun tombol konfirmasi di kanan, batal di kiri
    });

    if (result.isConfirmed) {
      Swal.showLoading();

      try {
        const docRef = doc(db, `data/${user?.uid}/links`, id);
        await deleteDoc(docRef);
        Swal.fire("Berhasil!", "Link berhasil dihapus!", "success");
      } catch (error) {
        Swal.fire("Gagal!", "Error menghapus data: " + error.message, "error");
      }
    }
  };
  const edit = async (id) => {};

  return (
    <AbsensiContext.Provider
      value={{ loading, links, add, close, open, trash, edit }}
    >
      {children}
    </AbsensiContext.Provider>
  );
};
