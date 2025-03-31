import React from "react";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-green-500">
      {/* Lewa sekcja */}
      <div className="w-1/3  flex flex-col justify-center items-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">LoyAll all you need</h1>
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-48 h-48 object-contain rounded-full"
        />
      </div>

      {/* Prawa sekcja */}
      <div className="w-2/3 flex flex-col justify-center items-center p-8 rounded-l-[2.5rem] bg-black">
        {children}
      </div>
    </div>
  );
}
