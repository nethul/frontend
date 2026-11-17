"use client";

import React from "react";
import { LotterySummary } from "@/types";
import { Building2, Layers, Calendar, Hash, RefreshCw } from "lucide-react";

interface LotterySelectorProps {
  categories: {
    NLB: LotterySummary[];
    DLB: LotterySummary[];
  };
  selectedCategory: "NLB" | "DLB";
  selectedLotteryId: string;
  onSelectCategory: (cat: "NLB" | "DLB") => void;
  onSelectLottery: (id: string) => void;
  isLoading?: boolean;
}

export const LotterySelector: React.FC<LotterySelectorProps> = ({
  categories,
  selectedCategory,
  selectedLotteryId,
  onSelectCategory,
  onSelectLottery,
  isLoading = false,
}) => {
  const currentList = categories[selectedCategory] || [];

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/80 border border-slate-800/80 w-fit">
        <button
          onClick={() => onSelectCategory("NLB")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === "NLB"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>NLB (National Lotteries Board)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/40 text-blue-200">
            {categories.NLB?.length || 5}
          </span>
        </button>

        <button
          onClick={() => onSelectCategory("DLB")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === "DLB"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>DLB (Development Lotteries Board)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/40 text-amber-200">
            {categories.DLB?.length || 10}
          </span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && currentList.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 animate-pulse space-y-2"
              >
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
        </div>
      ) : (
        /* Lottery Card / Pill Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {currentList.map((lottery) => {
            const isSelected = lottery.id === selectedLotteryId;
            return (
              <button
                key={lottery.id}
                onClick={() => onSelectLottery(lottery.id)}
                className={`text-left p-3 rounded-xl transition-all border relative overflow-hidden group ${
                  isSelected
                    ? selectedCategory === "NLB"
                      ? "bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50"
                      : "bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute top-0 right-0 w-2 h-2 rounded-full m-2 ${
                      selectedCategory === "NLB" ? "bg-blue-400 animate-ping" : "bg-amber-400 animate-ping"
                    }`}
                  />
                )}

                <div className="font-semibold text-sm text-slate-100 group-hover:text-white truncate">
                  {lottery.name}
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-500" />
                    {lottery.total_draws} draws
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {lottery.type === "digit" ? "Digits" : `1-${lottery.pool}`}
                  </span>
                </div>

                {lottery.latest_date && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 truncate">
                    <Calendar className="w-3 h-3" />
                    <span>{lottery.latest_date}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
