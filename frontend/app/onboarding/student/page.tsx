"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, GraduationCap, School, Target, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { studentApi } from "@/lib/api";
import { BlockBeams } from "@/component/ui/beam";

export default function StudentOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    category: "" as "11th" | "12th" | "dropper" | "partial_dropper" | "",
    school_type: "" as "dummy" | "regular" | "",
    target_year: new Date().getFullYear() + 1,
    target_exam: "JEE",
    target_score: "",
    whatsapp_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.category || !formData.school_type) {
      setError("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await studentApi.createProfile({
        category: formData.category,
        school_type: formData.school_type,
        target_year: formData.target_year,
        target_exam: formData.target_exam,
        target_score: formData.target_score ? parseInt(formData.target_score) : undefined,
        whatsapp_number: formData.whatsapp_number || undefined,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: "11th", label: "Class 11th", icon: "📚" },
    { value: "12th", label: "Class 12th", icon: "📖" },
    { value: "dropper", label: "Dropper", icon: "🎯" },
    { value: "partial_dropper", label: "Partial Dropper", icon: "⚡" },
  ];

  const schoolTypes = [
    { value: "dummy", label: "Dummy School", description: "Focusing fully on JEE" },
    { value: "regular", label: "Regular School", description: "Balancing school & JEE" },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-black" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Profile 🎓
          </h1>
          <p className="text-white/70">
            Help us personalize your JEE preparation journey
          </p>
        </div>

        <div className="relative bg-black border border-white/20 rounded-2xl p-8 overflow-hidden">
          <BlockBeams />
          <div className="relative z-10">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">
                  <GraduationCap className="inline w-4 h-4 mr-2" />
                  Your Current Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.value as typeof formData.category })
                      }
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.category === cat.value
                          ? "bg-white/10 border-white text-white"
                          : "bg-black border-white/20 text-white/70 hover:border-white/40"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{cat.icon}</span>
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            {/* School Type */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">
                <School className="inline w-4 h-4 mr-2" />
                School Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {schoolTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, school_type: type.value as typeof formData.school_type })
                    }
                    className={`p-4 rounded-lg border text-left transition-all ${
                      formData.school_type === type.value
                        ? "bg-white/10 border-white text-white"
                        : "bg-black border-white/20 text-white/70 hover:border-white/40"
                    }`}
                  >
                    <span className="font-medium block mb-1">{type.label}</span>
                    <span className="text-xs opacity-70">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <Target className="inline w-4 h-4 mr-2" />
                  Target Year
                </label>
                <select
                  value={formData.target_year}
                  onChange={(e) =>
                    setFormData({ ...formData, target_year: parseInt(e.target.value) })
                  }
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                >
                  {[2026, 2027, 2028, 2029, 2030].map((year) => (
                    <option key={year} value={year}>
                      JEE {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Target Score (Optional)
                </label>
                <input
                  type="number"
                  value={formData.target_score}
                  onChange={(e) =>
                    setFormData({ ...formData, target_score: e.target.value })
                  }
                  placeholder="e.g., 250"
                  min="0"
                  max="360"
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_number: e.target.value })
                }
                placeholder="+91 9876543210"
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
              <p className="text-xs text-white/50 mt-1">
                Get reminders and motivation on WhatsApp
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-white/90 text-black font-medium py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
