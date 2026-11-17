"use client";

import React, { useState } from "react";
import { BacktestResponse } from "@/types";
import {
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  Check,
  X,
  Target
} from "lucide-react";

interface BacktestDashboardProps {
  data: BacktestResponse | null;
  isLoading: boolean;
  testDraws: number;
  windowSize: number;
  onTestDrawsChange: (draws: number) => void;
  onWindowSizeChange: (win: number) => void;
}

export const BacktestDashboard: React.FC<BacktestDashboardProps> = ({
  data,
  isLoading,
  testDraws,
  windowSize,
  onTestDrawsChange,
  onWindowSizeChange,
}) => {
  const [filterType, setFilterType] = useState<"all" | "pool_hits" | "ticket_hits">("all");

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Running walk-forward historical backtest...</p>
      </div>
    );
  }

  if (!data) return null;

  const { overall_metrics, matches_distribution, pool_matches_distribution, draw_records, lottery, backtest_config } = data;

  const filteredRecords = draw_records.filter((rec) => {
    if (filterType === "pool_hits") return rec.pool_match_count > 0;
    if (filterType === "ticket_hits") return rec.match_count > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Configuration Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Walk-Forward Backtest Verification
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {backtest_config.start_date} → {backtest_config.end_date}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Historical Accuracy &bull; {lottery.name}
          </h2>
          <p className="text-xs text-slate-400">
            Comparing the Candidate Pool ({backtest_config.pool_size} numbers) vs. Single Exact Tickets
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Test Sample Size */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Test Draws:</span>
            {[15, 30, 50].map((n) => (
              <button
                key={n}
                onClick={() => onTestDrawsChange(n)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  testDraws === n
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Sliding Window Size */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Window:</span>
            {[50, 100, 200].map((w) => (
              <button
                key={w}
                onClick={() => onWindowSizeChange(w)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  windowSize === w
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Candidate Pool vs Single Ticket Comparison Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-indigo-950/40 border border-emerald-500/30 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Candidate Pool Success Rate ({backtest_config.pool_size} Balls)
            </h3>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {overall_metrics.pool_at_least_one_rate}%
            </span>
            <span className="text-xs text-slate-300">
              of draws had <strong className="text-emerald-300">at least 1 winning ball</strong> in the candidate pool
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span>&bull; ≥2 matches: <strong className="text-slate-200 font-mono">{overall_metrics.pool_at_least_two_rate}%</strong></span>
            <span>&bull; Overall Winning Ball Recall: <strong className="text-slate-200 font-mono">{overall_metrics.pool_overall_recall_rate}%</strong></span>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-slate-800 md:pl-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Single Exact Ticket Match Rate ({lottery.count_per_draw} Balls)
            </h3>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-indigo-400 font-mono">
              {overall_metrics.at_least_one_match_rate}%
            </span>
            <span className="text-xs text-slate-300">
              matched by a single 4-ball ticket ({overall_metrics.performance_vs_random_multiplier}x vs random chance)
            </span>
          </div>
          <div className="text-xs text-slate-400">
            <span>The Candidate Pool approach delivers <strong className="text-emerald-300">~{Math.round(overall_metrics.pool_at_least_one_rate / Math.max(1, overall_metrics.at_least_one_match_rate))}x higher hit consistency</strong> than exact combination guesses!</span>
          </div>
        </div>
      </div>

      {/* 3. Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pool Hit (≥1)</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {overall_metrics.pool_at_least_one_rate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {overall_metrics.pool_at_least_two_rate}% with ≥2 balls
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Winning Ball Recall</div>
            <div className="text-2xl font-black text-indigo-400 font-mono mt-1">
              {overall_metrics.pool_overall_recall_rate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              of all drawn numbers in pool
            </div>
          </div>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {lottery.has_symbol ? "Zodiac Symbol Hit" : "Bonus Letter Hit"}
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {lottery.has_symbol
                ? `${overall_metrics.symbol_accuracy_percentage ?? 0}%`
                : `${overall_metrics.letter_accuracy_percentage ?? 0}%`}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Exact Top-1 Markov prediction
            </div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Exact Ticket Hit</div>
            <div className="text-2xl font-black text-purple-400 font-mono mt-1">
              {overall_metrics.at_least_one_match_rate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Avg {overall_metrics.avg_matched_numbers_per_draw} numbers/draw
            </div>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Granular Verification Log (Table) */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Draw-by-Draw Historical Verification Log
            </h3>
            <p className="text-xs text-slate-400">
              Inspect each historical draw and check which winning balls were captured in the Candidate Pool
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filterType === "all" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({draw_records.length})
            </button>
            <button
              onClick={() => setFilterType("pool_hits")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filterType === "pool_hits" ? "bg-emerald-600 text-white" : "bg-slate-900 text-emerald-400 hover:text-emerald-300"
              }`}
            >
              Pool Hits
            </button>
            <button
              onClick={() => setFilterType("ticket_hits")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filterType === "ticket_hits" ? "bg-indigo-600 text-white" : "bg-slate-900 text-indigo-400 hover:text-indigo-300"
              }`}
            >
              Ticket Hits
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Draw / Date</th>
                <th className="py-3 px-4">Actual Ground Truth</th>
                <th className="py-3 px-4">Candidate Pool Coverage</th>
                <th className="py-3 px-4 text-center">Hit Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.map((rec) => {
                const poolHits = rec.pool_matched_numbers || [];
                return (
                  <tr
                    key={rec.draw_no || rec.date}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      rec.pool_match_count >= 2 ? "bg-emerald-950/15" : ""
                    }`}
                  >
                    {/* Draw No & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">#{rec.draw_no}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{rec.date}</div>
                    </td>

                    {/* Actual Ground Truth */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {rec.actual_letter && (
                          <span
                            className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                              rec.letter_match
                                ? "bg-blue-600 text-white ring-2 ring-blue-400"
                                : "bg-blue-950/60 text-blue-300 border border-blue-800"
                            }`}
                          >
                            {rec.actual_letter}
                          </span>
                        )}
                        {rec.actual_symbol && (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              rec.symbol_match
                                ? "bg-purple-600 text-white ring-2 ring-purple-400"
                                : "bg-purple-950/60 text-purple-300 border border-purple-800"
                            }`}
                          >
                            {rec.actual_symbol}
                          </span>
                        )}
                        {rec.actual_numbers.map((n, i) => {
                          const isInPool = poolHits.includes(n);
                          return (
                            <span
                              key={i}
                              className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                                isInPool
                                  ? "bg-emerald-500 text-slate-950 font-extrabold ring-2 ring-emerald-300 shadow-md shadow-emerald-500/30"
                                  : "bg-slate-800 text-slate-300 border border-slate-700"
                              }`}
                            >
                              {n}
                            </span>
                          );
                        })}
                        {rec.actual_special !== null && rec.actual_special !== undefined && (
                          <span
                            className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                              rec.special_match
                                ? "bg-rose-500 text-white ring-2 ring-rose-300"
                                : "bg-rose-950/60 text-rose-300 border border-rose-800"
                            }`}
                          >
                            {rec.actual_special}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Candidate Pool Coverage */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {rec.pool_numbers.slice(0, 10).map((n) => {
                          const isWinning = rec.actual_numbers.includes(n);
                          return (
                            <span
                              key={n}
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                isWinning
                                  ? "bg-emerald-500 text-slate-950 ring-1 ring-emerald-300 font-extrabold"
                                  : "bg-slate-900 text-slate-500 border border-slate-800"
                              }`}
                            >
                              {n}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Hit Summary Badges */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1 font-sans">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            rec.pool_match_count >= 2
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : rec.pool_match_count === 1
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800/60 text-slate-500 border border-slate-700/50"
                          }`}
                        >
                          {rec.pool_match_count > 0 ? (
                            <span>🎯 {rec.pool_match_count} in Pool ({poolHits.join(", ")})</span>
                          ) : (
                            <span>0 in pool</span>
                          )}
                        </span>

                        <div className="flex items-center gap-1">
                          {rec.letter_match && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Letter Hit
                            </span>
                          )}
                          {rec.letter_in_top_3 && !rec.letter_match && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-900/40 text-blue-300 border border-blue-800/40">
                              Letter in Top 3
                            </span>
                          )}
                          {rec.symbol_match && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Zodiac Hit
                            </span>
                          )}
                          {rec.special_match && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Powerball Hit
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
