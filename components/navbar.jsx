"use client";
import { useState, useRef, useEffect } from "react";

import { ttTrailers } from "@/app/ui/fonts";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <SmallNavbar />
      <LargeNavbar />
    </>
  );
}

function SmallNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 md:hidden bg-white shadow-md">
      <nav className="relative h-[70px]  w-full flex items-center justify-between px-4 md:px-8 lg:px-14 ">
        <h1
          className={`${ttTrailers.className} italic font-extrabold text-gray-800 text-3xl `}
        >
          <Link href="/">MoviesHub</Link>
        </h1>
        <div className="flex items-center gap-3 text-gray-800">
          <Link href="/search">
            <span className="material-symbols-outlined text-gray-700">
              search
            </span>
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isAuthenticated
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              title={isAuthenticated ? "Account" : "Login"}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isAuthenticated ? "text-white" : "text-gray-600"
                }`}
              >
                person
              </span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      logout
                    </span>
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setShowDropdown(false)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        login
                      </span>
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setShowDropdown(false)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        person_add
                      </span>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <span
            className="material-symbols-outlined "
            onClick={() => setIsOpen(!isOpen)}
          >
            menu
          </span>
        </div>
      </nav>
      {isOpen && (
        <div
          className={`relative w-full pb-2 px-4 ${isOpen ? "show" : "hide"}`}
        >
          <Link
            href="/search"
            className="flex items-center gap-2 w-full h-12 rounded-full border border-gray-400 px-5 text-gray-400"
          >
            <span className="material-symbols-outlined text-gray-400">
              search
            </span>
            Search for movies...
          </Link>
        </div>
      )}
    </div>
  );
}

function LargeNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="hidden md:sticky top-0 z-20 h-[70px] bg-white w-full md:flex items-center justify-between md:px-10 lg:px-15 xl:px-20 shadow-md">
      <h1
        className={`${ttTrailers.className} italic font-extrabold text-gray-800 text-3xl `}
      >
        <Link href="/">MoviesHub</Link>
      </h1>
      <div className="flex items-center gap-4 relative w-full justify-end">
        <Link
          href="/search"
          className="flex items-center gap-2 h-12 rounded-full border border-gray-400 px-5 text-gray-400 hover:border-gray-500 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-400">
            search
          </span>
          <span className="hidden md:inline">Search for movies...</span>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isAuthenticated
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            title={isAuthenticated ? "Account" : "Login"}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isAuthenticated ? "text-white" : "text-gray-600"
              }`}
            >
              person
            </span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setShowDropdown(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      login
                    </span>
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setShowDropdown(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      person_add
                    </span>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
