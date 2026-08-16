"use client";

import { ttTrailers } from "@/app/ui/fonts";

import { UserAvatar } from "@/components/UserAvatar";
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

          <UserAvatar size="md" />
        </div>
      </nav>
    </div>
  );
}

function LargeNavbar() {
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
        >
          <span className="material-symbols-outlined text-gray-400">
            search
          </span>
        </Link>

        <UserAvatar size="md" />
      </div>
    </nav>
  );
}
