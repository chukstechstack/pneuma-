import React from "react";

interface ScrollBadgeProps {
    message: string;
}

export const ScrollBadge: React.FC<ScrollBadgeProps> = ({ message }) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 hidden sm:flex items-center gap-3 bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/15 px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-bounce">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px] font-medium tracking-wide text-gray-200">{message}</span>
        </div>
    );
};