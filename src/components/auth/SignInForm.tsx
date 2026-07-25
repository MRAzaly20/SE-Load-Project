"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn as nextAuthSignIn, useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function SignInForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, isAuthenticated } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  React.useEffect(() => {
    if (status === "authenticated" || isAuthenticated || user || session) {
      router.replace("/");
    }
  }, [status, isAuthenticated, user, session, router]);

  const handleGoogleSSO = async () => {
    setLoadingProvider("google");
    try {
      await nextAuthSignIn("google", { callbackUrl: "/" });
    } catch (e) {
      console.error("Google SSO redirect error:", e);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGithubSSO = async () => {
    setLoadingProvider("github");
    try {
      await nextAuthSignIn("github", { callbackUrl: "/" });
    } catch (e) {
      console.error("GitHub SSO redirect error:", e);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-300/40 mb-3">
              Schneider Electric SSO Portal
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Engineer & Manager Sign In
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose your single sign-on provider (Google Workspace or GitHub Enterprise) to access Schneider ERP.
            </p>
          </div>

          {/* Social SSO Login Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleSSO}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-800 dark:text-white font-bold rounded-2xl transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                  fill="#4285F4"
                />
                <path
                  d="M10.1797 18.75C12.5859 18.75 14.597 17.9583 16.0924 16.575L13.2749 14.4333C12.4832 14.9667 11.4582 15.3167 10.1797 15.3167C7.83804 15.3167 5.85054 13.7375 5.14221 11.5958L5.0372 11.6047L2.27887 13.7375L2.24221 13.8375C3.72554 16.7833 6.74637 18.75 10.1797 18.75Z"
                  fill="#34A853"
                />
                <path
                  d="M5.14221 11.5958C4.95471 11.0375 4.84637 10.4375 4.84637 9.8125C4.84637 9.1875 4.95471 8.5875 5.14221 8.02917L5.13638 7.9157L2.33304 5.7417L2.24221 5.7875C1.61304 7.0375 1.25471 8.3875 1.25471 9.8125C1.25471 11.2375 1.61304 12.5875 2.24221 13.8375L5.14221 11.5958Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.1797 4.30833C11.888 4.30833 13.0422 5.04583 13.6964 5.6625L16.1547 3.2625C14.597 1.8125 12.5859 0.875 10.1797 0.875C6.74637 0.875 3.72554 2.84167 2.24221 5.7875L5.14221 8.02917C5.85054 5.8875 7.83804 4.30833 10.1797 4.30833Z"
                  fill="#EB4335"
                />
              </svg>
              <span>{loadingProvider === "google" ? "Connecting to Google..." : "Sign in with Google Workspace"}</span>
            </button>

            <button
              onClick={handleGithubSSO}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-gray-900 dark:bg-gray-800 text-white font-bold rounded-2xl transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50 border border-gray-800 dark:border-gray-700"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                />
              </svg>
              <span>{loadingProvider === "github" ? "Connecting to GitHub..." : "Sign in with GitHub Enterprise"}</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400">or use management login</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            </div>

            <button
              onClick={() => router.push("/admin-signin")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold rounded-2xl border border-emerald-300/60 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer text-xs"
            >
              🔒 Manager & Admin Password Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
