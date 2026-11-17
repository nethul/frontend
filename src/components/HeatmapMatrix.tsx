"use client";

import React, { useState } from "react";
import { HeatmapItem } from "@/types";
import { Flame, Snowflake, Clock, Activity, Filter } from "lucide-react";

interface HeatmapMatrixProps {
  items: HeatmapItem[];
  lotteryType: "number" | "digit";
  windowSize: number;
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({ items, lotteryType, windowSize }) => {
  const [filter, setFilter] = useState<"all" | "hot" | "due" | "cold">("all");
  const [hoveredItem, setHoveredItem] = useState<HeatmapItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const hotCount = items.filter((x) => x.status === "hot").length;
  const dueCount = items.filter((x) => x.status === "due").length;
  const coldCount = items.filter((x) => x.status === "cold").length;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Number Distribution & Velocity Heatmap
          </h3>
          <p className="text-xs text-slate-400">
            Real-time frequency velocities, appearance intervals, and Poisson gap deviations across {windowSize} draws
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === "all" ? "bg-slate-700 text-white" : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter("hot")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === "hot"
                ? "bg-rose-600/30 text-rose-300 border border-rose-500/50"
                : "bg-slate-900/60 text-slate-400 hover:text-rose-300"
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Hot ({hotCount})</span>
          </button>
          <button
            onClick={() => setFilter("due")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === "due"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/50"
                : "bg-slate-900/60 text-slate-400 hover:text-purple-300"
            }`}
          >
            <Clock className="w-3 h-3 text-purple-400" />
            <span>Due ({dueCount})</span>
          </button>
          <button
            onClick={() => setFilter("cold")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === "cold"
                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                : "bg-slate-900/60 text-slate-400 hover:text-cyan-300"
            }`}
          >
            <Snowflake className="w-3 h-3 text-cyan-400" />
            <span>Cold ({coldCount})</span>
          </button>
        </div>
      </div>

      {/* Grid of Number Cells */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {filteredItems.map((item) => {
          let badgeStyle = "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600";
          if (item.status === "hot") {
            badgeStyle = "bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-sm shadow-rose-500/10 hover:border-rose-400";
          } else if (item.status === "due") {
            badgeStyle = "bg-purple-950/40 border-purple-500/60 text-purple-200 shadow-sm shadow-purple-500/10 hover:border-purple-400";
          } else if (item.status === "cold") {
            badgeStyle = "bg-cyan-950/20 border-cyan-500/30 text-cyan-200/80 hover:border-cyan-400";
          }

          return (
            <div
              key={item.number}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 relative ${badgeStyle}`}
            >
              <div className="text-base font-extrabold font-mono">{item.number}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {item.frequency}x
              </div>
              <div className="text-[9px] text-slate-500">
                gap: {item.current_gap}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Detail Card */}
      {hoveredItem ? (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-mono flex items-center justify-center text-sm">
              {hoveredItem.number}
            </div>
            <div>
              <span className="font-semibold text-slate-200">
                Number #{hoveredItem.number} &bull;{" "}
                <span className="capitalize font-normal text-amber-400">{hoveredItem.status} Velocity</span>
              </span>
              <div className="text-[11px] text-slate-400">
                Composite Score: <strong className="text-slate-200 font-mono">{hoveredItem.score}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-300 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Window Frequency</span>
              <strong>{hoveredItem.frequency} appearances</strong> ({hoveredItem.percentage}%)
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Current Gap</span>
              <strong>{hoveredItem.current_gap} draws ago</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Expected Gap</span>
              <strong>every {hoveredItem.avg_gap} draws</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-slate-500 text-center py-1">
          Hover over any ball in the matrix to inspect exact recurrence velocities and gap distributions
        </div>
      )}
    </div>
  );
};
