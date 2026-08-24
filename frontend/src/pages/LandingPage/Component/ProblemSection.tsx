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
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-20 gap-8">
                <div className="max-w-4xl">
                    <span className="text-rose-500 text-xs font-black tracking-[0.3em] uppercase flex items-center gap-2 mb-4">
                        <AlertCircle size={14} className="animate-pulse" /> Section 05 // The Human Toll
                    </span>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase leading-[0.95]">
                        The Bleeding <br /> Edge of Silence
                    </h2>
                </div>
                <div className="max-w-md border-l-2 border-rose-500/30 pl-6 py-2">
                    <p className="text-lg text-gray-300 font-serif italic leading-relaxed">
                        "He who accepts evil without protesting against it is really cooperating with it."
                    </p>
                    <p className="text-gray-400 font-sans text-sm mt-3 leading-relaxed">
                        We have built an ultra-connected world, yet our brothers and sisters are dying alone in darkness. This is where the machine fails, and human lives break.
                    </p>
                </div>
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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7] group-hover:brightness-90" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent p-10 flex flex-col justify-end pointer-events-none">
                            <span className="text-rose-400 text-xs font-black tracking-widest uppercase mb-2">
                                {triage[0].location || "Sector 12 // The Connected Desert"}
                            </span>
                            <h3 className="text-3xl font-black text-white uppercase tracking-wide mb-3">
                                {triage[0].title || "THE ISOLATION OF PROGRESS"}
                            </h3>
                            <p className="text-gray-300 font-sans text-sm max-w-lg leading-relaxed">
                                {triage[0].caption || "We sit in rooms crowded with brilliant minds, yet we have never been more alone. We build systems to connect the world, but we leave the broken-hearted stranded in their own silence."}
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
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.6] group-hover:brightness-75" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                                <span className="text-rose-400 text-[10px] font-black tracking-widest uppercase mb-1">
                                    {triage[1].category || "The Digital Trap"}
                                </span>
                                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                                    {triage[1].title || "THE COLD MACHINE"}
                                </h3>
                                <p className="text-gray-300 font-sans text-xs line-clamp-2 mt-1 leading-relaxed">
                                    {triage[1].caption || "Our technology grows smarter, but our empathy grows colder. We have perfected the algorithms of distraction while our brothers and sisters tear themselves apart in the trenches of addiction."}
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
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.6] group-hover:brightness-75" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                                <span className="text-rose-400 text-[10px] font-black tracking-widest uppercase mb-1">
                                    {triage[2].category || "Broken Borders"}
                                </span>
                                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                                    {triage[2].title || "A PLANET IN THE DARK"}
                                </h3>
                                <p className="text-gray-300 font-sans text-xs line-clamp-2 mt-1 leading-relaxed">
                                    {triage[2].caption || "From space, our cities burn bright with electricity. On the ground, entire nations are plunged into the darkness of war and neglect. Our wealth is global, but our conscience remains localized."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
