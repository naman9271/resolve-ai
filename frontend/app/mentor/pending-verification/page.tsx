"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Mail, CheckCircle2, XCircle, GraduationCap, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { BlockBeams } from "@/component/ui/beam";

export default function PendingVerificationPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/mentor/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/mentor/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold text-white">
            RESOLVE AI
          </Link>
          <div className="flex items-center justify-center gap-2 mt-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <p className="text-amber-500 font-medium">Mentor Portal</p>
          </div>
        </div>

        <div className="relative bg-black border border-amber-500/30 rounded-2xl p-8 overflow-hidden text-center">
          <BlockBeams />
          <div className="relative z-10">
            {/* Pending Animation */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="w-12 h-12 text-amber-500" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-3">
              Application Under Review
            </h1>
            
            <p className="text-white/70 mb-6">
              Thank you for applying to become a mentor at Resolve AI! 
              Our team is reviewing your application.
            </p>

            {/* Status Steps */}
            <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-white font-medium mb-4">Verification Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Application Submitted</p>
                    <p className="text-white/50 text-xs">Your details have been received</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  </motion.div>
                  <div>
                    <p className="text-white text-sm font-medium">College Verification</p>
                    <p className="text-white/50 text-xs">Verifying your IIT/NIT enrollment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/50 text-sm font-medium">JEE Details Verification</p>
                    <p className="text-white/40 text-xs">Pending college verification</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/50 text-sm font-medium">Account Approval</p>
                    <p className="text-white/40 text-xs">Final review by admin team</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-amber-500 font-medium text-sm">We&apos;ll notify you</p>
                  <p className="text-white/60 text-xs mt-1">
                    You&apos;ll receive an email at <span className="text-white">{user?.email}</span> once 
                    your application is reviewed. This usually takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="text-white/50 text-sm mb-6">
              <p>Expected verification time: <span className="text-amber-500 font-medium">24-48 hours</span></p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition-all"
              >
                Return to Homepage
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors py-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <p className="text-center text-white/40 text-sm mt-6">
          Have questions? Contact us at{" "}
          <a href="mailto:mentors@resolveai.in" className="text-amber-500 hover:text-amber-400">
            mentors@resolveai.in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
