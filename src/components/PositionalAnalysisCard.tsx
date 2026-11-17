"use client";

import React, { useState } from "react";
import { PositionalAnalysisResponse, TicketValidationResponse } from "@/types";
import {
  Columns,
  Sparkles,
  Flame,
  Snowflake,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  TrendingUp,
  Cpu,
  ArrowRight
} from "lucide-react";

interface PositionalAnalysisCardProps {
  data: PositionalAnalysisResponse | null;
  isLoading: boolean;
  lotteryId: string;
}

export const PositionalAnalysisCard: React.FC<PositionalAnalysisCardProps> = ({
  data,
  isLoading,
  lotteryId,
}) => {
  const [selectedColumn, setSelectedColumn] = useState<number>(1);
  const [ticketInput, setTicketInput] = useState<string>("");
  const [validationResult, setValidationResult] = useState<TicketValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  if (isLoading || !data) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading positional matrix & Markov column models...</p>
      </div>
    );
  }

  const { columns, sum_filtering, lottery } = data;
  const currentCol = columns.find((c) => c.column_index === selectedColumn) || columns[0];

  const handleValidateTicket = async () => {
    // Parse digits
    const clean = ticketInput.replace(/[^0-9]/g, "");
    if (clean.length !== lottery.count_per_draw) {
      alert(`Please enter exactly ${lottery.count_per_draw} digits (e.g. ${Array(lottery.count_per_draw).fill(3).join("")})`);
      return;
    }
    const numbers = clean.split("").map((x) => parseInt(x, 10));

    setIsValidating(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/validate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json_stringify_payload(lotteryId, numbers),
      });
      if (!res.ok) throw new Error("Validation failed");
      const result: TicketValidationResponse = await res.json();
      setValidationResult(result);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Validation error");
    } finally {
      setIsValidating(false);
    }
  };

  function json_stringify_payload(lId: string, nums: number[]) {
    return JSON.stringify({ lottery_id: lId, numbers: nums });
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Machine-Specific Architecture
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {lottery.count_per_draw} Columns Analyzed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Positional Frequency & Markov Column Transitions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing hot/cold digits per machine drum (Columns 1 to {lottery.count_per_draw}) and 1st-order day-to-day Markov transitions (yesterday to today)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
              Sum Filter: {sum_filtering.recommended_min_sum} - {sum_filtering.recommended_max_sum}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Positional Column Selector & Matrix */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Columns className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Select Machine Column Drum to Inspect:
            </h3>
          </div>

          {/* Column tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {columns.map((col) => {
              const isSelected = col.column_index === selectedColumn;
              return (
                <button
                  key={col.column_index}
                  onClick={() => setSelectedColumn(col.column_index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>Col {col.column_index}</span>
                  {col.is_non_uniform && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Column Spotlight */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Drum Machine Uniformity
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-mono text-slate-100">
                Chi-Square p = {currentCol.chi2_p_value}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentCol.is_non_uniform
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {currentCol.is_non_uniform ? "Non-Uniform (Biased Machine)" : "Uniform"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentCol.is_non_uniform
                ? "This column drum shows statistically significant variance in digit frequency."
                : "Digits appear evenly distributed in this column drum over time."}
            </p>
          </div>

          <div className="space-y-1 md:border-l md:border-slate-800 md:pl-4">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Yesterday's Result in Col {currentCol.column_index}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/40 border border-indigo-400 text-indigo-200 font-black text-sm flex items-center justify-center font-mono">
                {currentCol.latest_digit}
              </div>
              <span className="text-xs text-slate-300">was drawn in the last draw</span>
            </div>
          </div>

          <div className="space-y-1 md:border-l md:border-slate-800 md:pl-4">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              1st-Order Markov Forecast (Next Draw)
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {currentCol.top_markov_next.map((m, i) => (
                <div
                  key={m.digit}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-1.5 text-xs font-mono"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px]">
                    {m.digit}
                  </span>
                  <span className="text-slate-300 font-bold">{m.probability}%</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              Top empirical transitions when yesterday's digit was {currentCol.latest_digit}
            </p>
          </div>
        </div>

        {/* Digits 0 to 9 Breakdown for Selected Column */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">
            Digit Frequencies & Hot/Cold Velocity in Column {currentCol.column_index}:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {currentCol.digits.map((item) => {
              let style = "bg-slate-900/60 border-slate-800 text-slate-300";
              if (item.status === "hot") {
                style = "bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-sm shadow-rose-500/10";
              } else if (item.status === "cold") {
                style = "bg-cyan-950/30 border-cyan-500/40 text-cyan-200";
              }
              return (
                <div key={item.digit} className={`p-2.5 rounded-xl border text-center transition-all ${style}`}>
                  <div className="text-lg font-black font-mono">{item.digit}</div>
                  <div className="text-[11px] font-bold mt-0.5">{item.percentage}%</div>
                  <div className="text-[9px] text-slate-400 capitalize">{item.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Digit Sum & Range Filter Engine (Ticket Eliminator) */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Digit Sum Envelope & Ticket Elimination Filter
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical filtering eliminates tickets falling in extreme sum tails or severe parity imbalances before buying
          </p>
        </div>

        {/* Visual Bell Curve Range */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              Historical Mean Sum: <strong className="text-white font-mono">{sum_filtering.mean_sum}</strong> (±{sum_filtering.std_sum})
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-200 font-semibold">Recommended Safe Zone ({sum_filtering.recommended_min_sum} - {sum_filtering.recommended_max_sum})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-400">Elimination Zone (&lt;{sum_filtering.hard_elimination_min} or &gt;{sum_filtering.hard_elimination_max})</span>
              </span>
            </div>
          </div>

          {/* Visual bar */}
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex relative">
            <div className="bg-rose-600/40 h-full" style={{ width: "20%" }} />
            <div className="bg-amber-500/40 h-full" style={{ width: "15%" }} />
            <div className="bg-emerald-500 h-full shadow-lg shadow-emerald-500/30" style={{ width: "30%" }} />
            <div className="bg-amber-500/40 h-full" style={{ width: "15%" }} />
            <div className="bg-rose-600/40 h-full" style={{ width: "20%" }} />
          </div>
        </div>

        {/* Interactive Ticket Tester */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span>Test Any {lottery.count_per_draw}-Digit Combination:</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              maxLength={lottery.count_per_draw}
              placeholder={`Enter ${lottery.count_per_draw} digits (e.g. ${lottery.count_per_draw === 6 ? "734829" : "3829"})`}
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono tracking-widest text-lg text-center focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleValidateTicket}
              disabled={isValidating || ticketInput.length !== lottery.count_per_draw}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              {isValidating ? "Validating..." : "Evaluate Ticket Probability"}
            </button>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                validationResult.verdict === "PASS"
                  ? "bg-emerald-950/30 border-emerald-500/60 text-emerald-200"
                  : validationResult.verdict === "BORDERLINE"
                  ? "bg-amber-950/30 border-amber-500/60 text-amber-200"
                  : "bg-rose-950/30 border-rose-500/60 text-rose-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {validationResult.verdict === "PASS" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : validationResult.verdict === "BORDERLINE" ? (
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="font-bold text-sm">
                    Verdict: {validationResult.verdict} &bull; Risk Score: {validationResult.risk_score}/100
                  </span>
                </div>
                <div className="text-xs font-mono font-bold">
                  Sum: {validationResult.sum} ({validationResult.odds_evens})
                </div>
              </div>

              {/* Explanations */}
              <div className="space-y-1 text-xs">
                {validationResult.flags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span>&bull;</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>

              {/* Positional digit check */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">Column Status:</span>
                {validationResult.positional_verdict.map((pv) => (
                  <span
                    key={pv.column}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      pv.status === "hot"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : pv.status === "cold"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    Col {pv.column}: #{pv.digit} ({pv.status})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
