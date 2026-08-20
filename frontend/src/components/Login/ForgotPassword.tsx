import React, { useState } from "react";
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSubmitted(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to send reset email. Please try again.";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-[#010102] text-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6 bg-black/60 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-serif text-white tracking-wide">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Enter your account email and we'll send you a secure link to reset your password.
            </p>
          </div>

          {submitted ? (
            /* Success State */
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={28} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm sm:text-base font-semibold text-white">Check your inbox</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xs">
                  If an account exists for <span className="text-white font-mono">{email}</span>, a recovery link has been sent.
                </p>
              </div>
              <Link
                to="/login"
                className="mt-4 text-xs sm:text-sm text-[#d4af37] hover:underline flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleResetRequest} className="flex flex-col gap-5">
              
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs sm:text-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5 w-full">
                <label className="block text-[11px] font-mono uppercase tracking-[0.2em] text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 bg-black/60 border border-white/15 rounded-xl py-3.5 text-white text-sm outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-[#d4af37]/60 py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.15)] flex items-center justify-center gap-3 rounded-xl cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="flex items-center justify-center pt-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;