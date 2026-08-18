import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#010102] text-gray-300 px-4 py-12 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        
        {/* Back Link */}
        <div>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37] hover:underline"
          >
            <ArrowLeft size={16} /> Back to Registration
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-3 text-[#d4af37] mb-2">
            <ShieldCheck size={28} />
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white font-mono">
              Terms & Privacy Policy
            </h1>
          </div>
          <p className="text-xs text-gray-500 font-mono">
            Last updated: August 18, 2026
          </p>
        </div>

        {/* Section 1: Terms of Service */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <FileText size={18} className="text-[#d4af37]" />
            <h2>1. Terms of Service</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Welcome to Pneuma. By accessing or using our application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1.5 pl-2">
            <li>You must be at least 13 years old to use this service.</li>
            <li>You are responsible for maintaining the security of your account and password.</li>
            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
          </ul>
        </section>

        {/* Section 2: Privacy Policy */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck size={18} className="text-[#d4af37]" />
            <h2>2. Privacy Policy</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Your privacy is important to us. It is Pneuma's policy to respect your privacy regarding any information we may collect from you across our application.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1.5 pl-2">
            <li>We only collect personal information when we truly need it to provide a service to you.</li>
            <li>We do not share any personally identifying information publicly or with third-parties, except when required to by law.</li>
            <li>We use secure session cookies and tokens to keep you logged in and protect your data.</li>
          </ul>
        </section>

        {/* Section 3: Contact */}
        <section className="flex flex-col gap-3 border-t border-white/10 pt-6">
          <h2 className="text-white font-semibold text-sm">3. Questions or Concerns?</h2>
          <p className="text-sm text-gray-400">
            If you have any questions about how we handle user data and these terms, feel free to reach out to our support team through your dashboard.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsPage;