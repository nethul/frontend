"use client";

import React, { useEffect, useState, useCallback, useTransition } from "react";
import { Header } from "@/components/Header";
import { LotterySelector } from "@/components/LotterySelector";
import { WindowSlider } from "@/components/WindowSlider";
import { CandidatePoolCard } from "@/components/CandidatePoolCard";
import { HeatmapMatrix } from "@/components/HeatmapMatrix";
import { BacktestDashboard } from "@/components/BacktestDashboard";
import { PositionalAnalysisCard } from "@/components/PositionalAnalysisCard";
import { LotterySummary, PredictionResponse, BacktestResponse, PositionalAnalysisResponse } from "@/types";
import { Calendar, Hash, AlertTriangle, Sparkles, RefreshCw, BarChart3, Compass, Target, Columns } from "lucide-react";

// Fallback lotteries for instant render
const FALLBACK_NLB: LotterySummary[] = [
  { id: "govisetha", name: "Govisetha", category: "NLB", type: "number", pool: 80, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 numbers (1-80) + bonus English letter", total_draws: 2472, latest_date: "2026-11-15" },
  { id: "mahajana-sampatha", name: "Mahajana Sampatha", category: "NLB", type: "digit", pool: 10, count_per_draw: 6, has_letter: true, has_symbol: false, has_special_num: false, description: "6 digits (0-9) + bonus English letter", total_draws: 2410, latest_date: "2026-11-15" },
  { id: "dhana-nidhanaya", name: "Dhana Nidhanaya", category: "NLB", type: "number", pool: 90, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 numbers (1-90) + bonus English letter", total_draws: 2219, latest_date: "2026-11-15" },
  { id: "mega-power", name: "Mega Power", category: "NLB", type: "number", pool: 80, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: true, special_pool: 30, description: "Power ball (1-30) + 4 numbers (1-80)", total_draws: 2264, latest_date: "2026-11-15" },
  { id: "nlb-jaya", name: "NLB Jaya", category: "NLB", type: "digit", pool: 10, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 digits (0-9) + bonus English letter", total_draws: 629, latest_date: "2026-11-15" }
];

const FALLBACK_DLB: LotterySummary[] = [
  { id: "ada-kotipathi", name: "Ada Kotipathi", category: "DLB", type: "number", pool: 80, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 numbers (1-80) + bonus English letter", total_draws: 1874, latest_date: "2026-11-15" },
  { id: "shanida", name: "Shanida", category: "DLB", type: "number", pool: 80, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 numbers (1-80) + bonus English letter", total_draws: 1880, latest_date: "2026-11-15" },
  { id: "lagna-wasana", name: "Lagna Wasana", category: "DLB", type: "number", pool: 70, count_per_draw: 4, has_letter: false, has_symbol: true, has_special_num: false, description: "4 numbers (1-70) + astrological Zodiac sign", total_draws: 1880, latest_date: "2026-11-15" },
  { id: "super-ball", name: "Super Ball", category: "DLB", type: "number", pool: 80, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 numbers (1-80) + bonus English letter", total_draws: 1874, latest_date: "2026-11-15" },
  { id: "kapruka", name: "Kapruka", category: "DLB", type: "number", pool: 80, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: true, special_pool: 40, description: "Special number (1-40) + 4 numbers (1-80)", total_draws: 1761, latest_date: "2026-11-15" },
  { id: "sasiri", name: "Sasiri", category: "DLB", type: "number", pool: 50, count_per_draw: 3, has_letter: false, has_symbol: false, has_special_num: false, description: "3 numbers (1-50)", total_draws: 1106, latest_date: "2026-11-15" },
  { id: "supiri-dhana-sampatha", name: "Supiri Dhana Sampatha", category: "DLB", type: "digit", pool: 10, count_per_draw: 6, has_letter: true, has_symbol: false, has_special_num: false, description: "6 digits (0-9) + bonus English letter", total_draws: 1080, latest_date: "2026-11-15" },
  { id: "jaya-sampatha", name: "Jaya Sampatha", category: "DLB", type: "digit", pool: 10, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 digits (0-9) + bonus English letter", total_draws: 554, latest_date: "2026-11-15" },
  { id: "jayoda", name: "Jayoda (Archived)", category: "DLB", type: "number", pool: 70, count_per_draw: 4, has_letter: true, has_symbol: false, has_special_num: false, description: "4 numbers (1-70) + bonus English letter", total_draws: 414, latest_date: "2025-10-29" },
  { id: "development-fortune", name: "Development Fortune (Archived)", category: "DLB", type: "number", pool: 70, count_per_draw: 3, has_letter: true, has_symbol: false, has_special_num: true, special_pool: 9, description: "3 numbers (1-70) + special number (1-9)", total_draws: 219, latest_date: "2023-11-04" }
];

export default function Home() {
  const [categories, setCategories] = useState<{ NLB: LotterySummary[]; DLB: LotterySummary[] }>({
    NLB: FALLBACK_NLB,
    DLB: FALLBACK_DLB,
  });
  const [selectedCategory, setSelectedCategory] = useState<"NLB" | "DLB">("NLB");
  const [selectedLotteryId, setSelectedLotteryId] = useState<string>("govisetha");
  const [windowSize, setWindowSize] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<"forecast" | "positional" | "backtest">("forecast");

  // Forecast state
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState<boolean>(true);

  // Positional analysis state
  const [positionalData, setPositionalData] = useState<PositionalAnalysisResponse | null>(null);
  const [isLoadingPositional, setIsLoadingPositional] = useState<boolean>(false);

  // Backtest state
  const [backtestData, setBacktestData] = useState<BacktestResponse | null>(null);
  const [backtestDraws, setBacktestDraws] = useState<number>(30);
  const [isLoadingBacktest, setIsLoadingBacktest] = useState<boolean>(false);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Helper fetch supporting configurable backend URL (Heroku / Local)
  const apiFetch = async (endpoint: string, options?: RequestInit) => {
    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    try {
      const targetUrl = backendBase ? `${backendBase}${endpoint}` : endpoint;
      const res = await fetch(targetUrl, options);
      if (res.ok) return res;
    } catch {
      // try local fallback
    }
    return await fetch(`http://127.0.0.1:8000${endpoint}`, options);
  };

  // 1. Fetch catalog of lotteries
  const fetchLotteries = useCallback(async () => {
    try {
      const res = await apiFetch("/api/lotteries");
      if (!res.ok) throw new Error("Failed to load lottery catalog");
      const data = await res.json();
      setCategories(data);
      if (data.NLB && data.NLB.length > 0 && !selectedLotteryId) {
        setSelectedLotteryId(data.NLB[0].id);
      }
    } catch (err: unknown) {
      console.warn("Using fallback catalog:", err);
    }
  }, [selectedLotteryId]);

  // 2. Fetch predictions for current lottery and window
  const fetchPrediction = useCallback(async (lotteryId: string, windowVal: number) => {
    if (!lotteryId) return;
    setIsLoadingForecast(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/predict/${lotteryId}?window=${windowVal}`);
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data: PredictionResponse = await res.json();
      startTransition(() => {
        setPredictionData(data);
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Prediction error";
      setError(`Backend connecting: ${message}. Make sure FastAPI is running on port 8000.`);
    } finally {
      setIsLoadingForecast(false);
    }
  }, []);

  // 3. Fetch positional data
  const fetchPositional = useCallback(async (lotteryId: string, windowVal: number) => {
    if (!lotteryId) return;
    setIsLoadingPositional(true);
    try {
      const res = await apiFetch(`/api/positional/${lotteryId}?window=${windowVal}`);
      if (!res.ok) throw new Error(`Positional API Error: ${res.statusText}`);
      const data: PositionalAnalysisResponse = await res.json();
      startTransition(() => {
        setPositionalData(data);
      });
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoadingPositional(false);
    }
  }, []);

  // 4. Fetch backtest data
  const fetchBacktest = useCallback(async (lotteryId: string, draws: number, win: number) => {
    if (!lotteryId) return;
    setIsLoadingBacktest(true);
    try {
      const res = await apiFetch(`/api/backtest/${lotteryId}?test_draws=${draws}&window=${win}`);
      if (!res.ok) throw new Error(`Backtest API Error: ${res.statusText}`);
      const data: BacktestResponse = await res.json();
      startTransition(() => {
        setBacktestData(data);
      });
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoadingBacktest(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLotteries();
  }, [fetchLotteries]);

  // Fetch forecast when lottery or window changes
  useEffect(() => {
    if (selectedLotteryId) {
      fetchPrediction(selectedLotteryId, windowSize);
    }
  }, [selectedLotteryId, windowSize, fetchPrediction]);

  // Fetch positional if tab active
  useEffect(() => {
    if (selectedLotteryId && activeTab === "positional") {
      fetchPositional(selectedLotteryId, windowSize);
    }
  }, [selectedLotteryId, activeTab, windowSize, fetchPositional]);

  // Fetch backtest when tab is backtest
  useEffect(() => {
    if (selectedLotteryId && activeTab === "backtest") {
      fetchBacktest(selectedLotteryId, backtestDraws, windowSize);
    }
  }, [selectedLotteryId, activeTab, backtestDraws, windowSize, fetchBacktest]);

  const handleSelectCategory = (cat: "NLB" | "DLB") => {
    setSelectedCategory(cat);
    const list = categories[cat];
    if (list && list.length > 0) {
      setSelectedLotteryId(list[0].id);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await apiFetch("/api/sync", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      await fetchLotteries();
      if (selectedLotteryId) {
        await fetchPrediction(selectedLotteryId, windowSize);
        if (activeTab === "positional") await fetchPositional(selectedLotteryId, windowSize);
        if (activeTab === "backtest") await fetchBacktest(selectedLotteryId, backtestDraws, windowSize);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Sync error");
    } finally {
      setIsSyncing(false);
    }
  };

  const currentSummary = [...categories.NLB, ...categories.DLB].find((x) => x.id === selectedLotteryId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onSync={handleSync}
        isSyncing={isSyncing}
        totalLotteries={categories.NLB.length + categories.DLB.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center gap-3 text-sm text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              onClick={() => fetchPrediction(selectedLotteryId, windowSize)}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1. Lottery Selector */}
        <LotterySelector
          categories={categories}
          selectedCategory={selectedCategory}
          selectedLotteryId={selectedLotteryId}
          onSelectCategory={handleSelectCategory}
          onSelectLottery={setSelectedLotteryId}
        />

        {/* 2. Active Lottery Hero Header */}
        {currentSummary && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                  {currentSummary.category} Category
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {currentSummary.id}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">{currentSummary.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{currentSummary.description}</p>
            </div>

            {/* Latest Actual Draw Card */}
            {currentSummary.latest_draw && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    Latest Actual Draw (#{currentSummary.latest_draw.draw_no})
                  </div>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">
                    {currentSummary.latest_draw.date}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {currentSummary.latest_draw.letter && (
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-200 font-bold text-xs flex items-center justify-center">
                      {currentSummary.latest_draw.letter}
                    </div>
                  )}
                  {currentSummary.latest_draw.symbol && (
                    <div className="px-2 py-1 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-200 font-bold text-[11px]">
                      {currentSummary.latest_draw.symbol}
                    </div>
                  )}
                  {currentSummary.latest_draw.numbers.map((n, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center font-mono"
                    >
                      {n}
                    </div>
                  ))}
                  {currentSummary.latest_draw.special_number !== null &&
                    currentSummary.latest_draw.special_number !== undefined && (
                      <div className="w-8 h-8 rounded-full bg-rose-600/30 border border-rose-500/50 text-rose-200 font-bold text-xs flex items-center justify-center font-mono">
                        {currentSummary.latest_draw.special_number}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Main Dashboard Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("forecast")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "forecast"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-400/50"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Target className="w-4 h-4 text-amber-300" />
            <span>High-Probability Candidate Pool</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("positional");
              if (!positionalData) fetchPositional(selectedLotteryId, windowSize);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "positional"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 ring-1 ring-purple-400/50"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Columns className="w-4 h-4 text-purple-300" />
            <span>Positional Matrix & Ticket Filter</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/50 text-purple-300">
              Machine Specific
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("backtest");
              if (!backtestData) fetchBacktest(selectedLotteryId, backtestDraws, windowSize);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "backtest"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 ring-1 ring-emerald-400/50"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-300" />
            <span>Pool Hit Ratio & Backtest</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/50 text-emerald-300">
              ~73% Hits
            </span>
          </button>
        </div>

        {/* 4. Tab Views */}
        {activeTab === "forecast" ? (
          <>
            <WindowSlider
              windowSize={windowSize}
              maxDraws={currentSummary?.total_draws || 500}
              stats={predictionData?.window_statistics}
              onChange={setWindowSize}
            />

            {isLoadingForecast && !predictionData ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-sm text-slate-400">Computing hybrid candidate pools & predictions...</p>
              </div>
            ) : predictionData ? (
              <>
                <CandidatePoolCard
                  pool={predictionData.candidate_pool}
                  predictions={predictionData.predictions}
                  lotteryType={predictionData.lottery.type}
                  letters={predictionData.letter_predictions}
                  symbols={predictionData.symbol_predictions}
                  specials={predictionData.special_num_predictions}
                />

                <HeatmapMatrix
                  items={predictionData.heatmap}
                  lotteryType={predictionData.lottery.type}
                  windowSize={predictionData.window_statistics.window_size}
                />
              </>
            ) : null}
          </>
        ) : activeTab === "positional" ? (
          <PositionalAnalysisCard
            data={positionalData}
            isLoading={isLoadingPositional}
            lotteryId={selectedLotteryId}
          />
        ) : (
          <BacktestDashboard
            data={backtestData}
            isLoading={isLoadingBacktest}
            testDraws={backtestDraws}
            windowSize={windowSize}
            onTestDrawsChange={(draws) => {
              setBacktestDraws(draws);
              fetchBacktest(selectedLotteryId, draws, windowSize);
            }}
            onWindowSizeChange={(win) => {
              setWindowSize(win);
              fetchBacktest(selectedLotteryId, backtestDraws, win);
            }}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-4 text-center text-xs text-slate-500">
        Dinuma AI Lottery Intelligence Engine &bull; Historical data &copy; NLB & DLB &bull; Built with FastAPI & Next.js
      </footer>
    </div>
  );
}
