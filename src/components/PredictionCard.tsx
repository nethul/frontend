"use client";

import React from "react";
import { PredictionSet } from "@/types";
import { Trophy, Sparkles, ShieldCheck, Compass, Info } from "lucide-react";

interface PredictionCardProps {
  predictions: PredictionSet[];
  lotteryType: "number" | "digit";
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ predictions, lotteryType }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Top Predicted Combinations</h2>
            <p className="text-xs text-slate-400">
              Ranked mathematical candidates synthesized from sliding-window momentum & Markov transitions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {predictions.map((p) => {
          const isRank1 = p.rank === 1;
          return (
            <div
              key={p.rank}
              className={`rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between transition-all ${
                isRank1
                  ? "bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 border-amber-500/40 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/20"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header Badge */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isRank1
                          ? "bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/30"
                          : p.rank === 2
                          ? "bg-slate-700 text-slate-200"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {p.rank}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      {isRank1 ? "Consensus Pick" : `Alternative #${p.rank - 1}`}
                    </span>
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
                    <ShieldCheck className={`w-3.5 h-3.5 ${isRank1 ? "text-amber-400" : "text-indigo-400"}`} />
                    <span className="text-xs font-bold font-mono text-slate-100">{p.confidence_score}%</span>
                    <span className="text-[10px] text-slate-400">conf.</span>
                  </div>
                </div>

                <div className="text-xs font-medium text-slate-300 mb-4 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{p.strategy}</span>
                </div>

                {/* Draw Balls Container */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 flex flex-wrap items-center justify-center gap-2.5">
                  {/* Bonus Letter if present */}
                  {p.letter && (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/30">
                      {p.letter}
                    </div>
                  )}

                  {/* Zodiac Symbol if present */}
                  {p.symbol && (
                    <div className="px-3 py-1.5 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-purple-600/20 ring-1 ring-purple-400/30">
                      ✨ {p.symbol}
                    </div>
                  )}

                  {/* Numbers */}
                  {p.numbers.map((num, i) => (
                    <div
                      key={i}
                      className={`w-11 h-11 rounded-full font-extrabold text-base flex items-center justify-center shadow-lg font-mono transition-transform hover:scale-105 ${
                        lotteryType === "digit"
                          ? "bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-600 text-amber-300 ring-1 ring-amber-400/30"
                          : isRank1
                          ? "bg-gradient-to-tr from-amber-600 via-yellow-600 to-amber-500 text-slate-950 shadow-amber-500/20 ring-2 ring-amber-300/40"
                          : "bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 text-white shadow-slate-900/50 ring-1 ring-slate-500/30"
                      }`}
                    >
                      {num}
                    </div>
                  ))}

                  {/* Special Ball / Powerball if present */}
                  {p.special_number !== null && p.special_number !== undefined && (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-pink-500 text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-rose-600/30 ring-2 ring-rose-400/40 font-mono">
                      {p.special_number}
                    </div>
                  )}
                </div>
              </div>

              {/* Rationale and Metrics footer */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Predicted Sum: <strong className="text-slate-200 font-mono">{p.sum}</strong></span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Parity: {p.numbers.filter((x) => x % 2 === 1).length} Odd / {p.numbers.filter((x) => x % 2 === 0).length} Even
                  </span>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-800/40">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{p.rationale}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
