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
  const isLogin = pathname?.includes("login") ?? false;

  return (
    <div
      className={`flex flex-col md:flex-row h-screen ${
        isLogin ? "bg-blue-500" : "bg-green-500"
      }`}
    >
      <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-white p-8 order-2 md:order-1 min-h-[250px] sm:min-h-[300px] md:min-h-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
          {isLogin ? "Witaj ponownie!" : "LoyAll - wszystko czego potrzebujesz"}
        </h1>
        <div className="relative w-32 h-32 md:w-48 md:h-48">
          <Image
            layout="fill"
            objectFit="contain"
            src="/logo.svg"
            alt="Logo Loyall Treasures"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center p-6 sm:p-8 md:rounded-l-[2.5rem] bg-gray-900 order-1 md:order-2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
