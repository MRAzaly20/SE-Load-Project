"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";

export default function AdminSignInForm() {
  const router = useRouter();

  const [username, setUsername] = useState("admin@se.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fillManagerCredentials = () => {
    setUsername("manager@se.com");
    setPassword("manager123");
    setErrorMsg(null);
  };

  const fillAdminCredentials = () => {
    setUsername("admin@se.com");
    setPassword("admin123");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Call NextAuth signIn with credentials so a real session cookie is created.
      // The CredentialsProvider authorize() in auth.ts validates the password and
      // returns the correct role (manager | admin) so the middleware lets the user through.
      const result = await signIn("credentials", {
        username,
        password,
        provider: username.toLowerCase().includes("admin") || username === "admin" ? "admin" : "manager",
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setErrorMsg("Invalid credentials. Please check your username and password.");
      } else if (result?.ok) {
        router.push(result.url || "/");
        router.refresh();
      } else {
        setErrorMsg("Authentication failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ← Back to SSO Sign In
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border-2 border-emerald-600/40 dark:border-emerald-500/40 shadow-2xl space-y-6">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-xs mb-3">
              🔒 Management & Governance Portal
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manager & Admin Authentication
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Designated password authentication for Schneider Electric Manager (Level 2) and System Administrator (Level 3) access.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Username / Email <span className="text-error-500">*</span></Label>
              <Input
                type="text"
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                placeholder="manager@se.com or admin@se.com"
                required
              />
            </div>

            <div>
              <Label>Designated Password <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="Enter designated password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            {/* Designated Credentials Reference Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs space-y-3">
              <span className="font-bold text-gray-800 dark:text-gray-200 block">
                🔑 Designated Level Passwords:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fillManagerCredentials}
                  className="p-2.5 bg-white dark:bg-gray-900 border border-purple-300 dark:border-purple-800 hover:border-purple-500 rounded-xl text-left transition-all cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-purple-700 dark:text-purple-300 text-[11px]">
                    👔 Level 2 — Manager
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    User: <code className="font-bold">manager</code><br />
                    Pass: <code className="font-bold text-purple-600 dark:text-purple-400">manager123</code>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="p-2.5 bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 rounded-xl text-left transition-all cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">
                    🔒 Level 3 — Admin
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    User: <code className="font-bold">admin</code><br />
                    Pass: <code className="font-bold text-emerald-600 dark:text-emerald-400">admin123</code>
                  </div>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              onClick={() => {
                console.log(" ");
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-3 text-xs rounded-xl cursor-pointer disabled:opacity-60"
            >
              {isLoading ? "Authenticating..." : "Authenticate & Access Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
