"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import { trackChatBill } from "@/lib/gtag";

export const AgentBillyEntryCard = () => {
    const { openChat } = useSplitBillChatStore();

    const handleOpen = () => {
        if (typeof window !== "undefined") {
            const pathname = window.location.pathname;
            const params = new URLSearchParams(window.location.search);
            const wizardStepParam = params.get("step");
            const wizardStep = wizardStepParam ? parseInt(wizardStepParam, 10) : undefined;

            trackChatBill.open({
                referrer_page: pathname,
                ...(pathname === "/split-bill" && wizardStep ? { wizard_step: wizardStep } : {}),
            });
        }
        openChat();
    };

    return (
        <button
            onClick={handleOpen}
            className="relative flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/95 hover:to-blue-600/95 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 group focus:outline-hidden cursor-pointer"
        >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
                <Image
                    src="/img/agent-billy.png"
                    alt="Agent Billy"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-white tracking-tight">
                    Bingung Mulai dari mana?
                </p>
                <p className="text-[11px] leading-relaxed mt-0.5 text-white/80 font-medium">
                    Chat aja ke Agent Billy, dipandu sampe beres!
                </p>
            </div>

            {/* CTA arrow */}
            <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-white" />
            </div>
        </button>
    );
};