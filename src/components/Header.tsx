"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, Database, Activity, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  onSync: () => Promise<void>;
  isSyncing: boolean;
  totalLotteries: number;
}

export const Header: React.FC<HeaderProps> = ({ onSync, isSyncing, totalLotteries }) => {
  const [syncedRecently, setSyncedRecently] = useState(false);

  const handleSyncClick = async () => {
    try {
      await onSync();
      setSyncedRecently(true);
      setTimeout(() => setSyncedRecently(false), 4000);
    } catch {
      // handled in parent
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Dinuma AI
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Pattern Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sri Lankan NLB & DLB Statistical Lottery Intelligence & Next-Draw Forecaster
            </p>
          </div>
        </div>

        {/* Status & Sync Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>FastAPI Server 8000</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{totalLotteries} Lotteries</span>
          </div>

          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
              syncedRecently
                ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Database...</span>
              </>
            ) : syncedRecently ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Synchronized!</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>Sync Supabase</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
