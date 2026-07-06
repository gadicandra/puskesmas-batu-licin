import React from "react";
import { HeartHandshake, Sparkles } from "lucide-react";

const MottoContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:mt-20 mb-10">
                <div className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-white p-6 md:p-10 shadow-sm">
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-secondary/10" />
                    <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white">
                            <HeartHandshake className="h-10 w-10" />
                        </div>
                        <div>
                            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-secondary">
                                <Sparkles className="h-4 w-4" />
                                Motto Pelayanan
                            </p>
                            <p className="text-2xl font-bold leading-relaxed text-slate-800 md:text-4xl">
                                &quot;Ramah dan profesional dalam pelayanan kesehatan, dan kepuasan Anda adalah harapan kami.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MottoContent;
