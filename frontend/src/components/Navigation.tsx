"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FaUserShield } from "react-icons/fa";

const Navigation = () => {
  const { user, logout } = useAuth();

  const isAdmin = user && user.role_id === 1;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Loyall
        </Link>
        <nav className="flex space-x-4 lg:space-x-6 justify-center items-center">
          <Link href="/" className="text-gray-700 hover:text-green-600">
            Strona główna
          </Link>
          <Link
            href="/discounts"
            className="text-gray-700 hover:text-green-600"
          >
            Zniżki
          </Link>
          <Link href="#" className="text-gray-700 hover:text-green-600">
            {" "}
            {/* Placeholder */}
            Powiadomienia
          </Link>
          <Link
            href="/contact-us"
            className="text-gray-700 hover:text-green-600"
          >
            Kontakt
          </Link>

          {/* Link do panelu admina widoczny tylko dla admina */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-gray-700 hover:text-green-600 flex items-center"
            >
              <FaUserShield className="mr-1 h-5 w-5 text-green-600" />{" "}
              {/* Opcjonalna ikona */}
              Panel admina
            </Link>
          )}

          {user ? (
            <>
              <span className="text-gray-700 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-2 sm:px-4 rounded hover:bg-red-700 text-sm sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="bg-green-600 text-white px-3 py-2 sm:px-4 rounded hover:bg-green-700 text-sm sm:text-base"
              >
                Zaloguj
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-green-600 text-green-600 px-3 py-2 sm:px-4 rounded hover:bg-green-700 hover:text-white text-sm sm:text-base"
              >
                Zarejestruj
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
