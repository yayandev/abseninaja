"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const Sidebar = () => {
  const { user, signout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Data Absensi", path: "/data-absensi" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden flex justify-between p-3 z-20 sticky">
        <button
          className="w-max bg-gray-800 text-white p-2 rounded-md"
          onClick={toggleSidebar}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex gap-3 items-center">
          <div className="text-end">
            <h4 className="text-sm font-semibold">{user?.displayName}</h4>
            <h5 className="text-xs font-semibold text-gray-500">
              {user?.email}
            </h5>
          </div>
          <Image
            height={40}
            width={40}
            src={user?.photoURL}
            className="w-10 h-10 rounded-full"
            alt=""
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 h-16 bg-gray-900">
            <Link href={"/"} className="text-2xl font-bold text-blue-500">
              AbseninAja
            </Link>
            <button
              className="w-max bg-gray-800 text-white p-2 rounded-md"
              onClick={toggleSidebar}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-grow overflow-y-auto">
            <ul className="px-4 py-4">
              {navItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link href={item.path}>
                    <span
                      className={`block py-2 px-4 rounded transition-colors duration-200 ${
                        pathname === item.path
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mb-2">
                <button onClick={signout} className="w-full">
                  <span
                    className={`block py-2 px-4 rounded transition-colors duration-200 hover:bg-red-500 text-red-500 hover:text-white`}
                  >
                    Keluar
                  </span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="p-4 bg-gray-900">
            <p className="text-sm">© 2024 AbseninAja</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
