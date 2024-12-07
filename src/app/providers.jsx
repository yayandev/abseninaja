"use client";
import { AbsensiProvider } from "@/context/AbsensiContext";
import { AuthProvider } from "@/context/AuthContext";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <AbsensiProvider>{children}</AbsensiProvider>
    </AuthProvider>
  );
};

export default Providers;
