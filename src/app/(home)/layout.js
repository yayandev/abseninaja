import localFont from "next/font/local";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "../providers";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "AbseninAja",
  description: "Solusi Absensi Online yang Tepat dan Efisien!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Providers>
          <div className="flex h-full bg-gray-100 flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 overflow-auto p-4">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
