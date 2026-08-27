import React, { useState, useEffect } from "react";
import { X, Edit3, Save, Loader2, Lock, User, Mail, FileText } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useProfileSettings, useUpdateProfile } from "@/hooks/useProfileSettings";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch settings via our custom hook (only runs when drawer is open)
  const { data: settingsData, isLoading: isFetching } = useProfileSettings(isOpen);
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  // Form editable states
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    bio: "",
    password: "",
  });

  // Populate form data once fetched
  useEffect(() => {
    if (settingsData) {
      setFormData({
        full_name: settingsData.full_name || "",
        email: settingsData.email || "",
        bio: settingsData.bio || "",
        password: "", // Keep password blank initially
      });
    }
  }, [settingsData]);

  // Reset UI states when drawer closes/opens
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    updateProfile(
      {
        full_name: formData.full_name,
        email: formData.email,
        bio: formData.bio,
        password: formData.password ? formData.password : undefined,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Account details updated successfully!");
          setIsEditing(false);
          onProfileUpdated();
          setTimeout(() => setSuccessMessage(""), 4000);
        },
        onError: (err: any) => {
          setErrorMessage(err.response?.data?.error || "Failed to update profile.");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    // 🌟 Centered Modal Container Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* 🌟 Centered Modal Box with Rounded Corners and Max Height */}
      <div className="w-full max-w-lg max-h-[90vh] bg-[#09090b] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <h2 className="font-serif text-xl font-bold tracking-wider uppercase text-white">
                Account Settings
              </h2>
              <p className="text-xs font-mono text-gray-400 mt-1">
                Manage your credentials and bio identity
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4af37] text-gray-400 hover:text-[#d4af37] transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              {successMessage}
            </div>
          )}

          {/* Loading or Form Body */}
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 size={32} className="text-[#d4af37] animate-spin mb-3" />
              <p className="text-xs font-mono tracking-widest uppercase">Fetching account records...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
                  <User size={13} className="text-[#d4af37]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
                  <Mail size={13} className="text-[#d4af37]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
                  <FileText size={13} className="text-[#d4af37]" />
                  <span>Sanctuary Bio</span>
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell the world your mission..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans resize-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
                  <Lock size={13} className="text-[#d4af37]" />
                  <span>
                    New Password{" "}
                    {isEditing && <span className="text-gray-500 lowercase">(leave blank to keep current)</span>}
                  </span>
                </label>
                <input
                  type="password"
                  disabled={!isEditing}
                  placeholder={isEditing ? "Enter new password..." : "••••••••••••"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans"
                />
              </div>

              {/* Action Buttons (Edit / Save / Cancel) */}
              <div className="pt-3">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-mono uppercase tracking-widest hover:bg-[#d4af37] hover:text-[#010102] transition-all cursor-pointer shadow-sm font-semibold"
                  >
                    <Edit3 size={15} />
                    <span>Edit Details</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3.5 rounded-xl border border-white/15 bg-white/5 text-gray-300 text-xs font-mono uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#d4af37] bg-[#d4af37] text-[#010102] text-xs font-mono uppercase tracking-widest font-bold hover:opacity-90 transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <>
                          <Save size={15} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer - Logout Button */}
        <div className="pt-6 border-t border-white/10 mt-6">
          <LogoutButton className="w-full justify-center py-3.5" />
        </div>

      </div>
    </div>
  );
};