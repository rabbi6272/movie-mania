"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";

export default function SignupForm() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const router = useRouter();

  const { isAuthenticated, signup } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    if (isAuthenticated) {
      toast.error("User is already logged in");
      router.push("/");
      return;
    }

    const email = formData.email;
    const password = formData.password;
    const fullName = formData.fullName;
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    const signupPromise = signup(fullName, email, password).then(() => {
      router.push("/");
    }).catch((error) => {
      console.error(error);
    });

    toast.promise(signupPromise, {
      loading: "Signing up...",
      success: "Signed up successfully!",
      error: (err) => {
        const errorMessage =
          err?.customData?._tokenResponse?.error?.message ||
          err?.code?.replace("auth/", "").replace(/-/g, "_").toUpperCase() ||
          err?.message ||
          "Sign up failed!";

        const formattedMessage = errorMessage
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase());

        return formattedMessage;
      },
    });
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px-32px)] px-4 md:px-0">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-w-full sm:w-[70%] md:w-[50%] lg:w-[30%] xl:w-[25%] p-5 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-3xl text-gray-700 font-semibold text-center">
          Sign Up
        </h1>
        <label htmlFor="fullName" className="pl-2 text-sm font-semibold text-gray-600">
          Full Name*
        </label>
        <Input
          required
          placeholder="John Doe"
          type={"text"}
          id="fullName"
          className={
            "text-gray-700 text-sm placeholder:text-gray-400 placeholder:text-xs rounded-full"
          }
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />

        <label htmlFor="email" className="pl-2 text-sm font-semibold text-gray-600">
          Email*
        </label>
        <Input
          required
          placeholder="someone@gmail.com"
          type={"text"}
          id="email"
          className={"text-gray-700 text-sm placeholder:text-gray-400 placeholder:text-xs rounded-full"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="password" className="pl-2 text-sm font-semibold text-gray-600">
          Password*{" "}
        </label>
        <Input
          required
          placeholder="******"
          type={"password"}
          id="password"
          className={"text-gray-700 text-sm placeholder:text-gray-400 placeholder:text-xs rounded-full"}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />{" "}
        <p className="w-full text-xs mb-3 text-gray-500 flex justify-between">
          <span>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400">
              Login
            </Link>
          </span>
          <span className="text-blue-400">Forgot Password?</span>
        </p>
        <Button type="submit" size="lg" className={"bg-black text-white w-full rounded-full px-6 font-semibold text-md"}>
          Sign Up{" "}
        </Button>
      </form>
    </div>
  );
}
