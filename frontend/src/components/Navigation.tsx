"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Loyall
        </Link>
        <nav className="flex space-x-6 justify-center items-center">
          <Link href="/" className="text-gray-700 hover:text-green-600">
            Home
          </Link>
          <Link
            href="/discounts"
            className="text-gray-700 hover:text-green-600"
          >
            Zniżki
          </Link>
          <Link href="#" className="text-gray-700 hover:text-green-600">
            Notifications
          </Link>
          <Link href="#" className="text-gray-700 hover:text-green-600">
            Contact Us
          </Link>
          {user ? (
            <>
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-700 hover:text-white"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
