"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  GraduationCap, 
  School, 
  Phone, 
  User,
  Mail,
  Lock,
  Calendar,
  Award,
  Shield,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { BlockBeams } from "@/component/ui/beam";

interface FormData {
  // Account Info
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  
  // College Details
  college_name: string;
  college_tier: "tier_1" | "iit" | "";
  branch: string;
  year_of_study: string;
  
  // JEE Details
  jee_advanced_qualified: boolean;
  jee_roll_number: string;
  jee_rank: string;
  
  // Personal Details
  date_of_birth: string;
  phone_number: string;
  
  // Profile
  bio: string;
  expertise_subjects: string[];
}

const STEPS = [
  { id: 1, title: "Account", icon: User },
  { id: 2, title: "College", icon: School },
  { id: 3, title: "JEE Details", icon: Award },
  { id: 4, title: "Verification", icon: Shield },
  { id: 5, title: "Profile", icon: GraduationCap },
];

const COLLEGES = [
  { tier: "iit", name: "IIT Bombay" },
  { tier: "iit", name: "IIT Delhi" },
  { tier: "iit", name: "IIT Madras" },
  { tier: "iit", name: "IIT Kanpur" },
  { tier: "iit", name: "IIT Kharagpur" },
  { tier: "iit", name: "IIT Roorkee" },
  { tier: "iit", name: "IIT Guwahati" },
  { tier: "iit", name: "IIT Hyderabad" },
  { tier: "iit", name: "IIT BHU" },
  { tier: "iit", name: "IIT Indore" },
  { tier: "iit", name: "IIT (ISM) Dhanbad" },
  { tier: "tier_1", name: "NIT Trichy" },
  { tier: "tier_1", name: "NIT Warangal" },
  { tier: "tier_1", name: "NIT Surathkal" },
  { tier: "tier_1", name: "NIT Calicut" },
  { tier: "tier_1", name: "NIT Rourkela" },
  { tier: "tier_1", name: "IIIT Hyderabad" },
  { tier: "tier_1", name: "IIIT Delhi" },
  { tier: "tier_1", name: "BITS Pilani" },
  { tier: "tier_1", name: "DTU (Delhi Technological University)" },
  { tier: "tier_1", name: "NSUT (Netaji Subhas University of Technology)" },
];

const BRANCHES = [
  "Computer Science & Engineering",
  "Electrical Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology",
  "Mathematics & Computing",
  "Engineering Physics",
];

const SUBJECTS = [
  "Physics",
  "Chemistry", 
  "Mathematics",
  "Physical Chemistry",
  "Organic Chemistry",
  "Inorganic Chemistry",
  "Mechanics",
  "Electromagnetism",
  "Thermodynamics",
  "Optics",
  "Modern Physics",
  "Calculus",
  "Algebra",
  "Coordinate Geometry",
  "Trigonometry",
];

export default function MentorRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    college_name: "",
    college_tier: "",
    branch: "",
    year_of_study: "",
    jee_advanced_qualified: false,
    jee_roll_number: "",
    jee_rank: "",
    date_of_birth: "",
    phone_number: "",
    bio: "",
    expertise_subjects: [],
  });

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = (step: number): boolean => {
    setError("");
    
    switch (step) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.full_name) {
          setError("Please fill all required fields");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        break;
      case 2:
        if (!formData.college_name || !formData.branch || !formData.year_of_study) {
          setError("Please fill all college details");
          return false;
        }
        break;
      case 3:
        if (!formData.jee_roll_number) {
          setError("JEE roll number is required for verification");
          return false;
        }
        break;
      case 4:
        if (!formData.date_of_birth || !formData.phone_number) {
          setError("Date of birth and phone number are required for verification");
          return false;
        }
        break;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setError("");

    try {
      // Clear any existing invalid tokens first
      localStorage.removeItem("resolve_ai_access_token");
      localStorage.removeItem("resolve_ai_refresh_token");
      
      let accessToken: string | null = null;
      
      // Always register fresh for mentor signup
      try {
        // First, try to register the user
        const registerResponse = await authApi.register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone_number,
          role: "mentor",
        });
        accessToken = registerResponse.access_token;
      } catch (regError: unknown) {
        // If registration fails due to email already existing, try to login
        let errorMessage = "Registration failed";
        if (regError instanceof Error) {
          errorMessage = regError.message;
        } else if (typeof regError === "object" && regError !== null) {
          errorMessage = JSON.stringify(regError);
        }
        
        if (errorMessage.toLowerCase().includes("already") || errorMessage.toLowerCase().includes("exists") || errorMessage.toLowerCase().includes("registered")) {
          try {
            const loginResponse = await authApi.login({
              email: formData.email,
              password: formData.password,
            });
            accessToken = loginResponse.access_token;
          } catch {
            throw new Error("Email already registered. Please use correct password or login from the mentor login page.");
          }
        } else {
          throw new Error(errorMessage);
        }
      }

      if (!accessToken) {
        throw new Error("Failed to get authentication token");
      }

      // Create mentor profile
      const selectedCollege = COLLEGES.find(c => c.name === formData.college_name);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/mentors/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          display_name: formData.full_name,
          college_name: formData.college_name,
          college_tier: selectedCollege?.tier || "tier_1",
          branch: formData.branch,
          year_of_study: parseInt(formData.year_of_study),
          jee_advanced_qualified: formData.jee_advanced_qualified,
          jee_roll_number: formData.jee_roll_number,
          jee_rank: formData.jee_rank ? parseInt(formData.jee_rank) : null,
          date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null,
          phone_number: formData.phone_number,
          bio: formData.bio,
          expertise_subjects: JSON.stringify(formData.expertise_subjects),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail || errorData);
        throw new Error(errorMsg || "Failed to create mentor profile");
      }

      // Redirect to pending verification page
      router.push("/mentor/pending-verification");
    } catch (err) {
      let errorMsg = "Registration failed";
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === "object" && err !== null) {
        errorMsg = JSON.stringify(err);
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentStep >= step.id
                ? "bg-amber-500 text-black"
                : "bg-white/10 text-white/50"
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 transition-all ${
                currentStep > step.id ? "bg-amber-500" : "bg-white/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-white mb-4">Create Your Account</h3>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          <User className="inline w-4 h-4 mr-2" />
          Full Name *
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => updateFormData("full_name", e.target.value)}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50"
          placeholder="Your full name"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          <Mail className="inline w-4 h-4 mr-2" />
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50"
          placeholder="your.email@iitb.ac.in"
          required
        />
        <p className="text-white/40 text-xs mt-1">Preferably use your college email</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Lock className="inline w-4 h-4 mr-2" />
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50"
            placeholder="••••••••"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-white mb-4">College Details</h3>
      
      <div className="relative z-50">
        <label className="block text-sm font-medium text-white/70 mb-2">
          <School className="inline w-4 h-4 mr-2" />
          College/Institute *
        </label>
        <select
          value={formData.college_name}
          onChange={(e) => {
            const selectedValue = e.target.value;
            const college = COLLEGES.find(c => c.name === selectedValue);
            setFormData(prev => ({
              ...prev,
              college_name: selectedValue,
              college_tier: college?.tier as "iit" | "tier_1" | "" || ""
            }));
          }}
          className="w-full bg-zinc-900 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer relative z-50"
        >
          <option value="">Select your college</option>
          <optgroup label="IITs">
            {COLLEGES.filter(c => c.tier === "iit").map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="NITs, IIITs & Others">
            {COLLEGES.filter(c => c.tier === "tier_1").map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </optgroup>
        </select>
        <p className="text-white/40 text-xs mt-1">Only IIT/NIT/Tier-1 colleges are accepted</p>
      </div>
      
      <div className="relative z-40">
        <label className="block text-sm font-medium text-white/70 mb-2">
          Branch/Department *
        </label>
        <select
          value={formData.branch}
          onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
          className="w-full bg-zinc-900 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer relative z-40"
        >
          <option value="">Select your branch</option>
          {BRANCHES.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>
      
      <div className="relative z-30">
        <label className="block text-sm font-medium text-white/70 mb-2">
          Year of Study *
        </label>
        <select
          value={formData.year_of_study}
          onChange={(e) => setFormData(prev => ({ ...prev, year_of_study: e.target.value }))}
          className="w-full bg-zinc-900 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer relative z-30"
        >
          <option value="">Select your year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
          <option value="5">5th Year (Dual Degree)</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-white mb-4">JEE Details</h3>
      <p className="text-white/60 text-sm mb-4">
        These details are required for verification purposes and will be kept confidential.
      </p>
      
      <div>
        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-white/20 hover:border-amber-500/50 transition-all">
          <input
            type="checkbox"
            checked={formData.jee_advanced_qualified}
            onChange={(e) => updateFormData("jee_advanced_qualified", e.target.checked)}
            className="w-5 h-5 accent-amber-500"
          />
          <div>
            <span className="text-white font-medium">JEE Advanced Qualified</span>
            <p className="text-white/50 text-sm">Check if you cleared JEE Advanced</p>
          </div>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          <Award className="inline w-4 h-4 mr-2" />
          JEE Roll Number *
        </label>
        <input
          type="text"
          value={formData.jee_roll_number}
          onChange={(e) => updateFormData("jee_roll_number", e.target.value)}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50"
          placeholder="Your JEE roll number"
          required
        />
        <p className="text-white/40 text-xs mt-1">
          This will be used to verify your JEE qualification
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          JEE Advanced Rank (Optional)
        </label>
        <input
          type="number"
          value={formData.jee_rank}
          onChange={(e) => updateFormData("jee_rank", e.target.value)}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50"
          placeholder="e.g., 2500"
          min="1"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-white mb-4">Personal Verification</h3>
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-500 font-medium text-sm">End-to-End Encryption</p>
            <p className="text-white/60 text-xs mt-1">
              All personal data is encrypted and only used for verification. 
              Your information is never shared with students.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          <Calendar className="inline w-4 h-4 mr-2" />
          Date of Birth *
        </label>
        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => updateFormData("date_of_birth", e.target.value)}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          <Phone className="inline w-4 h-4 mr-2" />
          Phone Number *
        </label>
        <input
          type="tel"
          value={formData.phone_number}
          onChange={(e) => updateFormData("phone_number", e.target.value)}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50"
          placeholder="+91 9876543210"
          required
        />
        <p className="text-white/40 text-xs mt-1">
          We will send a verification OTP to this number
        </p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-white mb-4">Your Mentor Profile</h3>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Bio (Optional)
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateFormData("bio", e.target.value)}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500/50 min-h-[100px]"
          placeholder="Tell students about yourself, your JEE journey, and how you can help them..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/70 mb-3">
          Expertise Subjects
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SUBJECTS.map(subject => (
            <label
              key={subject}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.expertise_subjects.includes(subject)
                  ? "bg-amber-500/20 border-amber-500 text-white"
                  : "border-white/20 text-white/70 hover:border-white/40"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.expertise_subjects.includes(subject)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData("expertise_subjects", [...formData.expertise_subjects, subject]);
                  } else {
                    updateFormData("expertise_subjects", formData.expertise_subjects.filter(s => s !== subject));
                  }
                }}
                className="sr-only"
              />
              <span className="text-sm">{subject}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">What happens next?</h4>
        <ul className="text-white/60 text-sm space-y-2">
          <li>✓ Your application will be reviewed by our team</li>
          <li>✓ We verify your college and JEE details</li>
          <li>✓ Once approved, you can start mentoring students</li>
          <li>✓ Earn ₹99/30min or ₹149/hour per session</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl"
      >
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold text-white">
            RESOLVE AI
          </Link>
          <div className="flex items-center justify-center gap-2 mt-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <p className="text-amber-500 font-medium">Become a Mentor</p>
          </div>
        </div>

        {renderStepIndicator()}

        <div className="relative bg-black border border-amber-500/30 rounded-2xl p-8 overflow-hidden">
          <BlockBeams />
          <div className="relative z-10">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
              </motion.div>

              <div className="flex items-center justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <Link
                    href="/mentor/login"
                    className="text-white/70 hover:text-amber-500 transition-colors text-sm"
                  >
                    Already have an account?
                  </Link>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-6 py-3 rounded-lg transition-all"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium px-6 py-3 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          By applying, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
