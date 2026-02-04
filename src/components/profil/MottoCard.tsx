import React from "react";

interface MottoCardProps {
    letter: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    textColor: string;
}

const MottoCard = ({ letter, title, subtitle, description, icon, color, textColor }: MottoCardProps) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-bold leading-none ${textColor}`}>{letter}</span>
            <div className="flex flex-col self-start">
                <span className="font-bold text-slate-800 text-lg leading-none">{title}</span>
                <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
            </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);

export default MottoCard;
