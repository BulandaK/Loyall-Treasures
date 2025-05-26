"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FaUserShield, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const Navigation = () => {
  const { user, logout } = useAuth();
  const isAdmin = user && user.role_id === 1;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {" "}
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
        >
          Loyall
        </Link>

        <div className="md:hidden">
          <button
            ref={buttonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <nav className="hidden md:flex space-x-3 lg:space-x-5 items-center">
          <Link
            href="/"
            className="text-gray-700 hover:text-green-600 px-2 py-1 rounded-md text-sm lg:text-base"
          >
            Strona główna
          </Link>
          <Link
            href="/discounts"
            className="text-gray-700 hover:text-green-600 px-2 py-1 rounded-md text-sm lg:text-base"
          >
            Zniżki
          </Link>
          <Link
            href="/favourites"
            className="text-gray-700 hover:text-green-600 px-2 py-1 rounded-md text-sm lg:text-base"
          >
            Ulubione
          </Link>
          <Link
            href="/contact-us"
            className="text-gray-700 hover:text-green-600 px-2 py-1 rounded-md text-sm lg:text-base"
          >
            Kontakt
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-gray-700 hover:text-green-600 flex items-center px-2 py-1 rounded-md text-sm lg:text-base"
            >
              <FaUserShield className="mr-1 h-5 w-5 text-green-600" />
              Panel admina
            </Link>
          )}

          {user ? (
            <>
              <span className="text-gray-700 hidden lg:inline px-2 py-1 text-sm">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1.5 sm:px-4 rounded-md hover:bg-red-600 text-sm transition-colors"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="bg-green-600 text-white px-3 py-1.5 sm:px-4 rounded-md hover:bg-green-700 text-sm transition-colors"
              >
                Zaloguj
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-green-600 text-green-600 px-3 py-1.5 sm:px-4 rounded-md hover:bg-green-700 hover:text-white text-sm transition-all"
              >
                Zarejestruj
              </Link>
            </>
          )}
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40 border-t border-gray-200"
        >
          <nav className="flex flex-col py-2">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-100 py-2 px-4 block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Strona główna
            </Link>
            <Link
              href="/discounts"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-100 py-2 px-4 block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Zniżki
            </Link>
            <Link
              href="/favourites"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-100 py-2 px-4 block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ulubione
            </Link>
            <Link
              href="/contact-us"
              className="text-gray-700 hover:text-green-600 hover:bg-gray-100 py-2 px-4 block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontakt
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-green-600 hover:bg-gray-100 flex items-center py-2 px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUserShield className="mr-2 h-5 w-5 text-green-600" />
                Panel admina
              </Link>
            )}

            <hr className="my-2 border-gray-200" />

            <div className="px-4 py-2 space-y-3">
              {user ? (
                <>
                  <span className="text-gray-700 py-2 block text-sm">
                    {user.email}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-red-500 text-white w-full text-center px-4 py-2.5 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Wyloguj
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="bg-green-600 text-white block text-center px-4 py-2.5 rounded-md hover:bg-green-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Zaloguj
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="border-2 border-green-600 text-green-600 block text-center px-4 py-2.5 rounded-md hover:bg-green-700 hover:text-white transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Zarejestruj
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
