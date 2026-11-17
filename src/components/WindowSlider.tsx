"use client";

import React from "react";
import { Sliders, History, TrendingUp, PieChart, Sparkles } from "lucide-react";
import { WindowStatistics } from "@/types";

interface WindowSliderProps {
  windowSize: number;
  maxDraws: number;
  stats?: WindowStatistics;
  onChange: (val: number) => void;
}

export const WindowSlider: React.FC<WindowSliderProps> = ({
  windowSize,
  maxDraws,
  stats,
  onChange,
}) => {
  const presets = [
    { label: "30 Draws (Micro/Hot)", val: 30 },
    { label: "50 Draws (Recent)", val: 50 },
    { label: "100 Draws (Balanced)", val: 100 },
    { label: "250 Draws (Macro)", val: 250 },
    { label: "Full History", val: maxDraws },
  ];

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Sliding Window Horizon
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono">
                {windowSize >= maxDraws ? "All-Time" : `${windowSize} Draws`}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Control the temporal depth for frequency decay, gap velocities, and Markov state transitions
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => {
            const isActive =
              (p.val === maxDraws && windowSize >= maxDraws) ||
              (p.val !== maxDraws && windowSize === p.val);
            return (
              <button
                key={p.label}
                onClick={() => onChange(p.val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slider Input */}
      <div className="space-y-1">
        <input
          type="range"
          min={20}
          max={Math.min(500, maxDraws || 500)}
          step={5}
          value={windowSize > maxDraws ? maxDraws : windowSize}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>20 draws (High recency sensitivity)</span>
          <span>500 draws (Smoothed macro trends)</span>
        </div>
      </div>

      {/* Window Statistical Metrics */}
      {stats && (
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mean Sum</div>
              <div className="text-sm font-bold text-slate-100 font-mono">
                {stats.mean_sum} <span className="text-[10px] text-slate-400 font-normal">± {stats.std_sum}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <History className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sum Range</div>
              <div className="text-sm font-bold text-slate-100 font-mono">
                {stats.min_sum} - {stats.max_sum}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <PieChart className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Odd / Even Ratio</div>
              <div className="text-sm font-bold text-slate-100 font-mono">
                {stats.odd_sum_percentage}% <span className="text-[10px] text-slate-400 font-normal">/ {stats.even_sum_percentage}%</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Evaluated Draws</div>
              <div className="text-sm font-bold text-slate-100 font-mono">
                {stats.window_size} <span className="text-[10px] text-slate-400 font-normal">draws</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
