"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const { isAuthenticated, login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    if (isAuthenticated) {
      toast.error("User is already logged in");
      router.push("/");
      return;
    }
    const email = formData.email;
    const password = formData.password;
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const loginPromise = login(email, password).then(() => {
      router.push("/");
    }).catch((error) => {
      console.error(error);
    });

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Logged in successfully!",
      error: (err) => {
        const errorMessage =
          err?.customData?._tokenResponse?.error?.message ||
          err?.code?.replace("auth/", "").replace(/-/g, "_").toUpperCase() ||
          err?.message ||
          "Log in failed!";

        const formattedMessage = errorMessage
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase());

        return formattedMessage;
      },
    });
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px)] px-4 md:px-0">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-w-full md:w-1/3 lg:w-1/4 p-5 bg-white shadow-md rounded-xl"
      >
        <h1 className="text-3xl text-gray-700 font-semibold text-center mb-2">Log In</h1>

        <div>
          <label htmlFor="email" className="pl-2 text-sm md:text-base font-semibold text-gray-600">
            Email*
          </label>
          <input
            required
            placeholder="someone@gmail.com"
            type={"text"}
            id="email"
            className={"w-full py-2 px-4 text-gray-700 text-sm md:text-base md:text-base placeholder:text-gray-400 placeholder:text-sm md:text-base bg-gray-50 border border-gray-300 rounded-full"}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="password" className="pl-2 text-sm md:text-base font-semibold text-gray-600">
            Password*{" "}
          </label>
          <input
            required
            placeholder="******"
            type={"password"}
            id="password"
            className={"w-full py-2 px-4 text-gray-700 text-sm md:text-base md:text-base placeholder:text-gray-400 placeholder:text-sm md:text-base bg-gray-50 border border-gray-300 rounded-full"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <p className="w-full text-sm mb-3 text-gray-500">
          <span>
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400">
              Signup
            </Link>
          </span>
        </p>
        <button type="submit" className={"bg-black text-white w-full rounded-full px-6 py-2.5 font-semibold text-lg"}>
          Log In
        </button>
      </form>
    </div>
  );
}
