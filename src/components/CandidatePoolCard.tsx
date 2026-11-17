"use client";

import React, { useState } from "react";
import { CandidatePool, LetterPrediction, SymbolPrediction, SpecialNumPrediction, PredictionSet } from "@/types";
import { Sparkles, Flame, Clock, Trophy, Layers, ChevronDown, ChevronUp, Compass, Award, ShieldAlert } from "lucide-react";

interface CandidatePoolCardProps {
  pool: CandidatePool;
  predictions: PredictionSet[];
  lotteryType: "number" | "digit";
  letters?: LetterPrediction[];
  symbols?: SymbolPrediction[];
  specials?: SpecialNumPrediction[];
}

export const CandidatePoolCard: React.FC<CandidatePoolCardProps> = ({
  pool,
  predictions,
  lotteryType,
  letters,
  symbols,
  specials,
}) => {
  const [showCombinations, setShowCombinations] = useState<boolean>(false);

  const top3Letters = letters?.slice(0, 3) || [];
  const top3Symbols = symbols?.slice(0, 3) || [];
  const top3Specials = specials?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* 1. Main High-Probability Candidate Pool Container */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950/70 to-slate-950/90 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Primary Recommendation Engine
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {pool.combined_pool_numbers.length} High-Probability Candidates
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Most Probable Numbers & Categoricals Pool
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeting individual candidate balls with the highest recurrence velocity and Poisson gap probabilities
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ~73% Historical Pool Hit Rate
            </span>
          </div>
        </div>

        {/* 2. Top Ranked Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {pool.numbers.map((item, idx) => {
            const isTier1 = pool.tier_1_core.includes(item.number);
            const isTier2 = pool.tier_2_momentum.includes(item.number);
            const isTier3 = pool.tier_3_due.includes(item.number);

            let tierBadge = { label: "Strong Candidate", color: "text-slate-400 bg-slate-800/80 border-slate-700" };
            if (isTier1) {
              tierBadge = { label: "🌟 Core Banker", color: "text-amber-300 bg-amber-500/20 border-amber-500/40" };
            } else if (isTier2) {
              tierBadge = { label: "⚡ High Velocity", color: "text-rose-300 bg-rose-500/20 border-rose-500/40" };
            } else if (isTier3) {
              tierBadge = { label: "⏰ Overdue Rebound", color: "text-purple-300 bg-purple-500/20 border-purple-500/40" };
            }

            return (
              <div
                key={item.number}
                className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isTier1
                    ? "bg-gradient-to-b from-amber-950/30 to-slate-900/80 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
                    : isTier2
                    ? "bg-gradient-to-b from-rose-950/20 to-slate-900/80 border-rose-500/40"
                    : isTier3
                    ? "bg-gradient-to-b from-purple-950/20 to-slate-900/80 border-purple-500/40"
                    : "bg-slate-900/50 border-slate-800"
                }`}
              >
                {/* Header rank */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 font-mono">
                    RANK #{idx + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tierBadge.color}`}>
                    {tierBadge.label}
                  </span>
                </div>

                {/* Big Ball Number */}
                <div className="my-2 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-full font-black text-xl flex items-center justify-center font-mono shadow-xl ${
                      isTier1
                        ? "bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-400 text-slate-950 ring-2 ring-amber-300/50 shadow-amber-500/20"
                        : isTier2
                        ? "bg-gradient-to-tr from-rose-600 to-red-500 text-white ring-2 ring-rose-400/40 shadow-rose-600/20"
                        : isTier3
                        ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white ring-2 ring-purple-400/40 shadow-purple-600/20"
                        : "bg-slate-800 text-slate-100 ring-1 ring-slate-700"
                    }`}
                  >
                    {item.number}
                  </div>
                </div>

                {/* Stats footer */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-center font-mono">
                  <div className="text-xs font-extrabold text-slate-200">
                    {item.probability}% <span className="text-[10px] text-slate-400 font-normal">prob.</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Freq: {item.frequency}x</span>
                    <span>Gap: {item.current_gap}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Most Probable Bonus Letters & Categoricals */}
        {(top3Letters.length > 0 || top3Symbols.length > 0 || top3Specials.length > 0) && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top 3 Letters */}
            {top3Letters.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-400" />
                    Top 3 Bonus Letters
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Markov Trans.</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {top3Letters.map((l, i) => (
                    <div
                      key={l.letter}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-blue-500/30 text-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm mx-auto flex items-center justify-center shadow-md shadow-blue-600/30">
                        {l.letter}
                      </div>
                      <div className="text-xs font-bold text-blue-300 font-mono mt-1.5">
                        {l.probability}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        #{i + 1} pick
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top 3 Zodiac Signs */}
            {top3Symbols.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-purple-400" />
                    Top 3 Zodiac Signs
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Astrological</span>
                </div>
                <div className="space-y-1.5">
                  {top3Symbols.map((s, i) => (
                    <div
                      key={s.symbol}
                      className="p-2 rounded-xl bg-slate-950/60 border border-purple-500/20 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-purple-200">
                        ✨ {s.symbol}
                      </span>
                      <span className="font-mono font-bold text-purple-400">
                        {s.probability}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top 3 Powerball / Special Numbers */}
            {top3Specials.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Top 3 Powerballs
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Special Pool</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {top3Specials.map((sp, i) => (
                    <div
                      key={sp.number}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/30 text-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold text-sm mx-auto flex items-center justify-center shadow-md shadow-rose-600/30 font-mono">
                        {sp.number}
                      </div>
                      <div className="text-xs font-bold text-rose-300 font-mono mt-1.5">
                        {sp.probability}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        #{i + 1} pick
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Collapsible Exact Combination Tickets */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowCombinations(!showCombinations)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-900/40 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-sm font-bold text-slate-200">
                Suggested 4-Ball Combination Tickets
              </span>
              <span className="text-xs text-slate-400 ml-2 font-normal hidden sm:inline">
                (Synthesized subsets for standard play)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
            <span>{showCombinations ? "Hide Tickets" : "Show 3 Suggested Tickets"}</span>
            {showCombinations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showCombinations && (
          <div className="p-4 pt-0 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-3">
            {predictions.map((p) => (
              <div key={p.rank} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Ticket #{p.rank}</span>
                  <span className="text-[11px] text-amber-400 font-mono">{p.confidence_score}% confidence</span>
                </div>

                <div className="flex items-center justify-center gap-2 flex-wrap py-2">
                  {p.letter && (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                      {p.letter}
                    </div>
                  )}
                  {p.symbol && (
                    <div className="px-2 py-1 rounded bg-purple-600 text-white font-bold text-xs">
                      ✨ {p.symbol}
                    </div>
                  )}
                  {p.numbers.map((n) => (
                    <div key={n} className="w-9 h-9 rounded-full bg-slate-800 text-slate-100 font-bold text-sm flex items-center justify-center font-mono">
                      {n}
                    </div>
                  ))}
                  {p.special_number !== null && p.special_number !== undefined && (
                    <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center font-mono">
                      {p.special_number}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 text-center">
                  Strategy: {p.strategy} (Sum: {p.sum})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
