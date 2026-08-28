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

  // Fetch settings via custom hook (only runs when drawer is open)
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
        password: "",
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
    // 🌟 Overlay: Bottom-sheet aligned on mobile, centered modal on desktop
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in p-0 sm:p-4">
      
      {/* Drawer Container */}
      <div className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] bg-[#09090b] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Modal Header */}
        <div>
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10">
            <div>
              <h2 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-white">
                Account Settings
              </h2>
              <p className="text-xs font-sans text-gray-400 mt-0.5">
                Manage your credentials and bio identity
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4af37] text-gray-400 hover:text-[#d4af37] transition-all cursor-pointer"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-sans">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-sans">
              {successMessage}
            </div>
          )}

          {/* Loading or Form Body */}
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 size={30} className="text-[#d4af37] animate-spin mb-3" />
              <p className="text-xs font-sans tracking-wide">Fetching account records...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-5 space-y-4 sm:space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-sans font-medium text-gray-300">
                  <User size={14} className="text-[#d4af37]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-sans font-medium text-gray-300">
                  <Mail size={14} className="text-[#d4af37]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-sans font-medium text-gray-300">
                  <FileText size={14} className="text-[#d4af37]" />
                  <span>Sanctuary Bio</span>
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell the world your mission..."
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans resize-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-sans font-medium text-gray-300">
                  <Lock size={14} className="text-[#d4af37]" />
                  <span>
                    New Password{" "}
                    {isEditing && <span className="text-gray-500 lowercase text-xs font-normal">(leave blank to keep current)</span>}
                  </span>
                </label>
                <input
                  type="password"
                  disabled={!isEditing}
                  placeholder={isEditing ? "Enter new password..." : "••••••••••••"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none disabled:opacity-60 transition-all font-sans"
                />
              </div>

              {/* Action Buttons (Edit / Save / Cancel) */}
              <div className="pt-2">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-sans uppercase tracking-wider hover:bg-[#d4af37] hover:text-[#010102] transition-all cursor-pointer shadow-sm font-semibold"
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
                      className="flex-1 py-3 sm:py-3.5 rounded-xl border border-white/15 bg-white/5 text-gray-300 text-xs font-sans uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl border border-[#d4af37] bg-[#d4af37] text-[#010102] text-xs font-sans uppercase tracking-wider font-bold hover:opacity-90 transition-all cursor-pointer shadow-md disabled:opacity-50"
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
        <div className="pt-4 sm:pt-6 border-t border-white/10 mt-5 sm:mt-6 shrink-0">
          <LogoutButton className="w-full justify-center py-3 sm:py-3.5" />
        </div>

      </div>
    </div>
  );
};