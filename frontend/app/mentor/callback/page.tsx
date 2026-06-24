"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { mentorApi } from "@/lib/api";

function MentorCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your login...");

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      if (accessToken && refreshToken) {
        // Store tokens
        localStorage.setItem("resolve_ai_access_token", accessToken);
        localStorage.setItem("resolve_ai_refresh_token", refreshToken);

        // Clear URL params
        window.history.replaceState({}, "", "/mentor/callback");

        // Refresh user data
        await refreshUser();

        setStatus("success");
        setMessage("Login successful! Checking mentor profile...");

        // Check if mentor has a profile
        try {
          const profile = await mentorApi.getProfile();
          if (profile) {
            if (profile.verification_status === "approved") {
              router.push("/mentor/dashboard");
            } else if (profile.verification_status === "pending") {
              router.push("/mentor/pending-verification");
            } else {
              router.push("/mentor/register");
            }
          }
        } catch {
          // No mentor profile, redirect to registration
          router.push("/mentor/register");
        }
      } else {
        setStatus("error");
        setMessage("Failed to process login. Please try again.");
        setTimeout(() => router.push("/mentor/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, refreshUser, router, user]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-white/70">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-white/70">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function MentorCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-white/70">Loading...</p>
          </div>
        </div>
      }
    >
      <MentorCallbackContent />
    </Suspense>
  );
}
