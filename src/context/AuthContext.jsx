"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import Cookies from "js-cookie";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  loading: true,
  user: null,
  isAuthenticated: false,
  setLoading: () => {},
  setUser: () => {},
  setIsAuthenticated: () => {},
  loginWithGoogle: () => {},
  signout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }

        setLoading(false);
      });
    };

    verifyAuth();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          Cookies.set("accessToken", token);
          // The signed-in user info.
          const user = result.user;
          setUser(user);
          setIsAuthenticated(true);
          if (user) {
            Swal.fire({
              title: "Berhasil!",
              text: `Selamat Datang Kembali ${user?.displayName}`,
              icon: "success",
            });
          }
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorMessage);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    // Menampilkan SweetAlert konfirmasi
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      reverseButtons: true, // Membalikkan urutan tombol konfirmasi dan batal
    });

    if (result.isConfirmed) {
      setLoading(true); // Menampilkan indikator loading

      try {
        await signOut(auth); // Melakukan sign-out dari autentikasi
        Cookies.remove("accessToken"); // Menghapus token
        setUser(null); // Menghapus user dari state
        setIsAuthenticated(false); // Set status autentikasi menjadi false
        router.push("/");
        Swal.fire({
          title: "Berhasil!",
          text: "Anda telah keluar dari akun.",
          icon: "success",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat keluar.",
          icon: "error",
        });
      } finally {
        setLoading(false); // Menyembunyikan indikator loading
      }
    } else {
      Swal.fire({
        title: "Batal!",
        text: "Anda tetap berada di akun.",
        icon: "info",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex w-full bg-white justify-center items-center">
        <svg
          className="w-12 h-12 text-gray-300 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-900"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loginWithGoogle,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
