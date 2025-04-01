"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Zmienna określająca, czy to logowanie czy rejestracja
  const isLogin = pathname.includes("login");

  return (
    <div
      className={`flex h-screen ${isLogin ? "bg-blue-500" : "bg-green-500"}`}
    >
      {/* Lewa sekcja */}
      <div className="w-1/3 flex flex-col justify-center items-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">
          {isLogin ? "Welcome Back!" : "LoyAll all you need"}
        </h1>
        <Image
          width={200}
          height={200}
          src="/logo.svg"
          alt="Logo"
          className="w-48 h-48 object-contain rounded-full"
        />
      </div>

      {/* Prawa sekcja */}
      <div className="w-2/3 flex flex-col justify-center items-center p-8 rounded-l-[2.5rem] bg-gray-900">
        {children}
      </div>
    </div>
  );
}
