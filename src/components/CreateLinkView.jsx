"use client";

import { useAbsensi } from "@/context/AbsensiContext";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

const CreateLinkView = () => {
  const { loading, add } = useAbsensi();
  const [values, setValues] = useState({
    name: "",
    closedAt: "",
  });

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validasi form sebelum mengirim data
    if (!values.name || !values.closedAt) {
      Swal.fire("Warning!", "Nama dan Close At tidak boleh kosong!", "warning");
      return;
    }

    // Panggil fungsi add dari context untuk menambahkan data
    add(values.name, values.closedAt);

    // Reset form setelah submit (opsional)
    // setValues({ name: "", closedAt: "" });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3 p-5"
    >
      <div className="p-3 rounded bg-white space-y-3">
        <div className="space-y-1">
          <label htmlFor="name" className="inline-block font-semibold">
            Nama Link
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange} // Menambahkan onChange untuk input "name"
            className="py-2 px-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            placeholder="Masukkan Nama Link"
          />
        </div>
      </div>

      <div className="p-3 rounded bg-white space-y-3">
        <div className="space-y-1">
          <label htmlFor="closedAt" className="inline-block font-semibold">
            Close At
          </label>
          <input
            type="datetime-local"
            id="closedAt"
            name="closedAt"
            value={values.closedAt}
            onChange={handleChange} // Menambahkan onChange untuk input "closedAt"
            className="py-2 px-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="p-3 rounded bg-white space-y-3">
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition duration-300"
          >
            {loading ? "Tunggu Sebentar..." : "Submit"}
          </button>
          <Link
            href="/data-absensi"
            className="inline-block px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-300"
          >
            Batal
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CreateLinkView;
