import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { AlertCircle } from "lucide-react";

export const ProblemSection: React.FC = () => {
    const [triageRef, triageVisible] = useScrollReveal(0.1);
    // Sliced for Section 5's crisis and emergency medical/humanitarian problem data
    const triage = PNEUMA_IMAGES.slice(11, 15);

    return (
        <section id="triage" ref={triageRef} className={`py-40 px-6 md:px-12 max-w-[1700px] mx-auto transition-opacity duration-700 ${triageVisible ? "opacity-100" : "opacity-0"}`}>
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <span className="text-rose-500 text-xs font-black tracking-[0.3em] uppercase flex items-center gap-2">
                        <AlertCircle size={14} className="animate-pulse" /> Section 05 // The Human Crisis
                    </span>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase mt-2">
                        Systemic Neglect & Suffering
                    </h2>
                </div>
                <p className="text-gray-400 font-sans max-w-md text-sm leading-relaxed">
                    Behind institutional red tape and digital isolation lie real people facing medical abandonment, untreated addiction, and silent despair.
                </p>
            </div>

            {/* Asymmetric Problem Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Main Featured Crisis Card */}
                {triage[0] && (
                    <div className="lg:col-span-7 relative h-[520px] rounded-3xl overflow-hidden border border-white/15 group shadow-2xl bg-[#0d0d14]">
                        <img 
                            src={triage[0].url} 
                            alt={triage[0].title} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-10 flex flex-col justify-end pointer-events-none">
                            <span className="text-rose-400 text-xs font-black tracking-widest uppercase mb-2">
                                {triage[0].location || "Sector 05 // Medical Isolation"}
                            </span>
                            <h3 className="text-3xl font-black text-white uppercase tracking-wide mb-3">
                                {triage[0].title || "Abandoned in Hospital Wards"}
                            </h3>
                            <p className="text-gray-300 font-sans text-sm max-w-lg leading-relaxed">
                                {triage[0].caption || "Thousands suffer without financial means for critical care, left trapped behind bureaucratic health barriers."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Secondary Problem Cards Stack */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {triage[1] && (
                        <div className="relative h-[244px] rounded-3xl overflow-hidden border border-white/15 group shadow-xl bg-[#0d0d14]">
                            <img 
                                src={triage[1].url} 
                                alt={triage[1].title} 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                                <span className="text-rose-400 text-[10px] font-black tracking-widest uppercase mb-1">
                                    {triage[1].category || "Behavioral Trap"}
                                </span>
                                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                                    {triage[1].title || "The Digital Doom-Loop"}
                                </h3>
                                <p className="text-gray-300 font-sans text-xs line-clamp-2 mt-1">
                                    {triage[1].caption || "Addiction and isolation tearing communities apart from the inside out."}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {triage[2] && (
                        <div className="relative h-[244px] rounded-3xl overflow-hidden border border-white/15 group shadow-xl bg-[#0d0d14]">
                            <img 
                                src={triage[2].url} 
                                alt={triage[2].title} 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                                <span className="text-rose-400 text-[10px] font-black tracking-widest uppercase mb-1">
                                    {triage[2].category || "Community Collapse"}
                                </span>
                                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                                    {triage[2].title || "Fractured Societies"}
                                </h3>
                                <p className="text-gray-300 font-sans text-xs line-clamp-2 mt-1">
                                    {triage[2].caption || "Nations and neighborhoods left stranded without immediate boots-on-the-ground support."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};