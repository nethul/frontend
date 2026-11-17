export interface LotterySummary {
  id: string;
  name: string;
  category: "NLB" | "DLB";
  type: "number" | "digit";
  pool: number;
  count_per_draw: number;
  has_letter: boolean;
  has_symbol: boolean;
  has_special_num: boolean;
  special_pool?: number;
  description: string;
  total_draws: number;
  latest_draw?: {
    draw_no: number;
    date: string;
    letter?: string;
    symbol?: string;
    numbers: number[];
    special_number?: number;
  };
  earliest_date?: string;
  latest_date?: string;
}

export interface PredictionSet {
  rank: number;
  strategy: string;
  confidence_score: number;
  numbers: number[];
  letter?: string | null;
  symbol?: string | null;
  special_number?: number | null;
  sum: number;
  rationale: string;
}

export interface HeatmapItem {
  number: number;
  frequency: number;
  percentage: number;
  current_gap: number;
  avg_gap: number;
  status: "hot" | "cold" | "due" | "neutral";
  score: number;
  probability: number;
}

export interface CandidatePool {
  pool_size: number;
  numbers: HeatmapItem[];
  tier_1_core: number[];
  tier_2_momentum: number[];
  tier_3_due: number[];
  combined_pool_numbers: number[];
}

export interface LetterPrediction {
  letter: string;
  probability: number;
  frequency: number;
}

export interface SymbolPrediction {
  symbol: string;
  probability: number;
  frequency: number;
}

export interface SpecialNumPrediction {
  number: number;
  frequency: number;
  probability: number;
}

export interface WindowStatistics {
  window_size: number;
  mean_sum: number;
  std_sum: number;
  min_sum: number;
  max_sum: number;
  odd_sum_percentage: number;
  even_sum_percentage: number;
}

export interface PredictionResponse {
  lottery: {
    id: string;
    name: string;
    category: "NLB" | "DLB";
    type: "number" | "digit";
    pool: number;
    count_per_draw: number;
    has_letter: boolean;
    has_symbol: boolean;
    has_special: boolean;
    special_pool: number;
    total_draws_analyzed: number;
    total_available_draws: number;
    latest_draw_date: string;
    latest_draw_no: number;
  };
  window_statistics: WindowStatistics;
  candidate_pool: CandidatePool;
  predictions: PredictionSet[];
  heatmap: HeatmapItem[];
  letter_predictions: LetterPrediction[];
  symbol_predictions: SymbolPrediction[];
  special_num_predictions: SpecialNumPrediction[];
}

export interface ColumnDigitStat {
  digit: number;
  count: number;
  percentage: number;
  status: "hot" | "cold" | "neutral";
}

export interface MarkovNextTransition {
  digit: number;
  probability: number;
}

export interface ColumnPositionalData {
  column_index: number;
  latest_digit: number;
  chi2_p_value: number;
  is_non_uniform: boolean;
  digits: ColumnDigitStat[];
  top_markov_next: MarkovNextTransition[];
}

export interface SumFilteringRules {
  mean_sum: number;
  std_sum: number;
  recommended_min_sum: number;
  recommended_max_sum: number;
  hard_elimination_min: number;
  hard_elimination_max: number;
  historical_min_sum: number;
  historical_max_sum: number;
}

export interface PositionalAnalysisResponse {
  lottery: {
    id: string;
    name: string;
    category: "NLB" | "DLB";
    type: "number" | "digit";
    count_per_draw: number;
  };
  window_size: number;
  columns: ColumnPositionalData[];
  sum_filtering: SumFilteringRules;
}

export interface PositionalVerdictItem {
  column: number;
  digit: number;
  status: "hot" | "cold" | "neutral";
  is_markov_favorable: boolean;
}

export interface TicketValidationResponse {
  ticket: number[];
  sum: number;
  odds_evens: string;
  risk_score: number;
  verdict: "PASS" | "BORDERLINE" | "ELIMINATE";
  flags: string[];
  positional_verdict: PositionalVerdictItem[];
  recommended_sum_range: string;
}

export interface BacktestDrawRecord {
  draw_no: number;
  date: string;
  actual_numbers: number[];
  actual_letter?: string | null;
  actual_symbol?: string | null;
  actual_special?: number | null;
  predicted_numbers: number[];
  predicted_letter?: string | null;
  predicted_symbol?: string | null;
  predicted_special?: number | null;
  matched_numbers: number[];
  match_count: number;
  pool_matched_numbers: number[];
  pool_match_count: number;
  pool_numbers: number[];
  letter_match: boolean;
  letter_in_top_3: boolean;
  symbol_match: boolean;
  symbol_in_top_3: boolean;
  special_match: boolean;
  confidence_score: number;
}

export interface MatchDistributionItem {
  match_count: number;
  occurrences: number;
  percentage: number;
}

export interface BacktestResponse {
  lottery: {
    id: string;
    name: string;
    category: "NLB" | "DLB";
    type: "number" | "digit";
    pool: number;
    count_per_draw: number;
    has_letter: boolean;
    has_symbol: boolean;
    has_special: boolean;
  };
  backtest_config: {
    test_draws_count: number;
    window_size: number;
    pool_size: number;
    start_date: string;
    end_date: string;
  };
  overall_metrics: {
    total_draws_tested: number;
    pool_at_least_one_rate: number;
    pool_at_least_two_rate: number;
    pool_at_least_three_rate: number;
    pool_overall_recall_rate: number;
    avg_matched_numbers_per_draw: number;
    random_baseline_expectation: number;
    performance_vs_random_multiplier: number;
    at_least_one_match_rate: number;
    at_least_two_match_rate: number;
    letter_accuracy_percentage?: number | null;
    symbol_accuracy_percentage?: number | null;
    special_ball_accuracy_percentage?: number | null;
  };
  pool_matches_distribution: MatchDistributionItem[];
  matches_distribution: MatchDistributionItem[];
  draw_records: BacktestDrawRecord[];
}
