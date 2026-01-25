"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem("resolve_ai_access_token", accessToken);
      localStorage.setItem("resolve_ai_refresh_token", refreshToken);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      // No tokens, redirect to login
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
        <p className="text-neutral-400">Signing you in...</p>
      </div>
    </div>
  );
}
