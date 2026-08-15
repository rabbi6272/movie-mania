"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/db/firebaseConfig";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const { userID, login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    if (userID) {
      toast.error("User is already logged in");
      router.push("/");
      return;
    }
    const email = formData.email;
    const password = formData.password;
    const loginPromise = signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        login(userCredential.user.uid);
        router.push("/");
      },
    );

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
        className="space-y-3 max-w-full md:w-1/3 lg:w-1/4 p-5 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-2xl text-gray-700 font-bold text-center">Log In</h1>
        <label htmlFor="email" className="text-sm text-gray-600">
          Email*
        </label>
        <Input
          required
          placeholder="someone@gmail.com"
          type={"text"}
          id="email"
          className={"text-gray-700"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="password" className="text-sm text-gray-600">
          Password*{" "}
        </label>
        <Input
          required
          placeholder="******"
          type={"password"}
          id="password"
          className={"text-gray-700"}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />{" "}
        <p className="w-full text-xs mb-3 text-gray-500 flex justify-between">
          <span>
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400">
              Signup
            </Link>
          </span>
          <span className=" text-blue-400">Forgot Password?</span>
        </p>
        <Button type="submit" className={"rounded-full px-6 font-medium"}>
          Log In{" "}
        </Button>
      </form>
    </div>
  );
}
