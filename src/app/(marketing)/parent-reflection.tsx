import React from "react";
import { MessageSquareQuote, ShieldAlert } from "lucide-react";

export default function ParentReflection() {
  return (
    <section id="reflection" className="py-12 sm:py-16 md:py-20 bg-paper border-b border-sand-deep/50">
      <div className="max-w-4xl 2xl:max-w-5xl 4k:max-w-6xl mx-auto px-4 sm:px-6 2xl:px-8">
        
        {/* Editorial Parent Reflection Card */}
        <div className="wj-card p-6 sm:p-10 md:p-12 border-2 border-sand-deep/80 bg-white rounded-3xl shadow-sm relative overflow-hidden text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-sand-deep/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-5 h-5 text-ocean-deep" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-mango-deep">
                Parent Reflection &bull; Local Editorial Placeholder
              </span>
            </div>

            {/* Sender Authorization Guard Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 border border-sand-deep/70 text-[10px] sm:text-xs font-mono font-bold text-ocean-deep">
              <ShieldAlert className="w-3.5 h-3.5 text-sunset-deep shrink-0" aria-hidden="true" />
              <span>PENDING EXPLICIT SENDER AUTHORIZATION FOR PUBLIC USE</span>
            </div>
          </div>

          {/* Local Editorial Placeholder (No Reconstructed Quotation or Paraphrased Claims) */}
          <div className="my-6 p-6 sm:p-8 rounded-2xl bg-paper border-2 border-dashed border-sand-deep/70 text-center">
            <p className="font-mono text-xs sm:text-sm text-ink/70 font-bold uppercase tracking-wider mb-2">
              Private Editorial Placeholder &bull; Awaiting Sender Approval
            </p>
            <p className="text-sm sm:text-base text-ocean-deep font-medium max-w-2xl mx-auto leading-relaxed">
              Authentic parent communication is held in private review until explicit sender authorization is granted. In accordance with editorial truthfulness standards, reconstructed quotes and paraphrased sentiments are not published. Upon sender approval, only the exact authorized excerpt will appear here.
            </p>
          </div>

          {/* Anonymized Attribution & Protection Protocol */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-sand-deep/40 text-xs text-ink/75 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-ocean-deep font-bold">
                Status: Local Review Only
              </span>
              <span className="text-[11px] text-ink/60 font-mono">
                &bull; Not published for public marketing
              </span>
            </div>

            <div className="text-[11px] text-ink/60 font-mono">
              Sender identity, contact info, timestamps, and payment details strictly excised.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

