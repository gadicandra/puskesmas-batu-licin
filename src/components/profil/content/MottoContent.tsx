import React from "react";
import MottoCard from "../MottoCard";
import { Heart, Shield, Users, Lightbulb, Target, Mail } from "lucide-react";

const MottoContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mt-20 mb-10">
                <MottoCard
                    letter="C"
                    title="Compassionate"
                    subtitle="Cepat"
                    description="Memberikan pelayanan yang cepat dan tanggap kepada setiap pasien."
                    icon={<Heart className="w-6 h-6 text-pink-500" />}
                    color="bg-pink-50"
                    textColor="text-pink-600"
                />
                <MottoCard
                    letter="E"
                    title="Empathy"
                    subtitle="Efektif"
                    description="Memberikan pelayanan yang efektif dan efisien sesuai standar."
                    icon={<Shield className="w-6 h-6 text-blue-500" />}
                    color="bg-blue-50"
                    textColor="text-blue-600"
                />
                <MottoCard
                    letter="R"
                    title="Respect"
                    subtitle="Ramah"
                    description="Melayani dengan ramah, sopan, dan santun kepada semua pengunjung."
                    icon={<Users className="w-6 h-6 text-green-500" />}
                    color="bg-green-50"
                    textColor="text-green-600"
                />
                <MottoCard
                    letter="D"
                    title="Dedication"
                    subtitle="Disiplin"
                    description="Disiplin dalam waktu dan prosedur pelayanan kesehatan."
                    icon={<Lightbulb className="w-6 h-6 text-amber-500" />}
                    color="bg-amber-50"
                    textColor="text-amber-600"
                />
                <MottoCard
                    letter="A"
                    title="Accountable"
                    subtitle="Akuntabel"
                    description="Dapat dipertanggungjawabkan sesuai dengan peraturan yang berlaku."
                    icon={<Target className="w-6 h-6 text-purple-500" />}
                    color="bg-purple-50"
                    textColor="text-purple-600"
                />
                <MottoCard
                    letter="S"
                    title="Smile"
                    subtitle="Senyum"
                    description="Selalu memberikan senyuman dalam setiap pelayanan."
                    icon={<Mail className="w-6 h-6 text-cyan-500" />}
                    color="bg-cyan-50"
                    textColor="text-cyan-600"
                />
            </div>
        </div>
    );
};

export default MottoContent;
