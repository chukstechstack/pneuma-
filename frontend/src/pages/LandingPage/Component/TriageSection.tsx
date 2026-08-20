import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { AlertCircle } from "lucide-react";

export const TriageSection: React.FC = () => {
    const [triageRef] = useScrollReveal(0.1);
    const triage = PNEUMA_IMAGES.slice(11, 15);

    return (
        <section id="triage" ref={triageRef} className="py-40 px-6 md:px-12 max-w-[1700px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <span className="text-rose-500 text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                        <AlertCircle size={14} className="animate-pulse" /> Sector 05 // Emergency Protocol
                    </span>
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white uppercase mt-2">Rapid Triage</h2>
                </div>
                <p className="text-gray-400 font-sans max-w-md text-sm">
                    Automated crisis flags designed to catch system overloads and network fractures instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {triage[0] && (
                    <div className="lg:col-span-7 relative h-[520px] rounded-3xl overflow-hidden border border-white/15 group shadow-2xl">
                        <img src={triage[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-10 flex flex-col justify-end">
                            <span className="text-rose-400 text-xs uppercase tracking-widest mb-2">{triage[0].location}</span>
                            <h3 className="text-3xl font-bold text-white mb-2">{triage[0].title}</h3>
                            <p className="text-gray-300 font-sans text-sm max-w-lg">{triage[0].caption}</p>
                        </div>
                    </div>
                )}

                <div className="lg:col-span-5 flex flex-col gap-6">
                    {triage[1] && (
                        <div className="relative h-[244px] rounded-3xl overflow-hidden border border-white/15 group shadow-xl">
                            <img src={triage[1].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] p-6 flex flex-col justify-end">
                                <h3 className="text-xl font-bold text-white">{triage[1].title}</h3>
                            </div>
                        </div>
                    )}
                    {triage[2] && (
                        <div className="relative h-[244px] rounded-3xl overflow-hidden border border-white/15 group shadow-xl">
                            <img src={triage[2].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] p-6 flex flex-col justify-end">
                                <h3 className="text-xl font-bold text-white">{triage[2].title}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};