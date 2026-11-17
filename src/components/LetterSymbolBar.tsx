"use client";

import React from "react";
import { LetterPrediction, SymbolPrediction, SpecialNumPrediction } from "@/types";
import { Sparkles, Compass, ShieldAlert } from "lucide-react";

interface LetterSymbolBarProps {
  letters?: LetterPrediction[];
  symbols?: SymbolPrediction[];
  specials?: SpecialNumPrediction[];
}

export const LetterSymbolBar: React.FC<LetterSymbolBarProps> = ({
  letters,
  symbols,
  specials,
}) => {
  const hasContent = (letters && letters.length > 0) || (symbols && symbols.length > 0) || (specials && specials.length > 0);
  if (!hasContent) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Letter Markov Probability Card */}
      {letters && letters.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Bonus Letter Markov Transitions
            </h4>
            <span className="text-[10px] text-slate-500">P(Next | Prev)</span>
          </div>

          <div className="space-y-2">
            {letters.slice(0, 5).map((item, idx) => (
              <div key={item.letter} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                      idx === 0
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.letter}
                  </div>
                  <span className="text-slate-300 font-medium">Letter {item.letter}</span>
                  <span className="text-[10px] text-slate-500">({item.frequency} draws)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, item.probability * 3)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold text-blue-300 w-11 text-right">
                    {item.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zodiac Symbol Transition Card */}
      {symbols && symbols.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              Astrological Sign Forecaster
            </h4>
            <span className="text-[10px] text-slate-500">Zodiac Transitions</span>
          </div>

          <div className="space-y-2">
            {symbols.slice(0, 5).map((item, idx) => (
              <div key={item.symbol} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      idx === 0
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.symbol}
                  </span>
                  <span className="text-[10px] text-slate-500">({item.frequency}x)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, item.probability * 3)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold text-purple-300 w-11 text-right">
                    {item.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Ball / Powerball Card */}
      {specials && specials.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Powerball / Special Ball Recurrence
            </h4>
            <span className="text-[10px] text-slate-500">Top Candidates</span>
          </div>

          <div className="space-y-2">
            {specials.slice(0, 5).map((item, idx) => (
              <div key={item.number} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs font-mono ${
                      idx === 0
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.number}
                  </div>
                  <span className="text-slate-300 font-medium">Ball #{item.number}</span>
                  <span className="text-[10px] text-slate-500">({item.frequency} draws)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-rose-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, item.probability * 3)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold text-rose-300 w-11 text-right">
                    {item.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
