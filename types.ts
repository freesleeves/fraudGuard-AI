export interface SMEProfile {
  business_id: string;
  business_name: string;
  industry: string;
  jurisdiction: string;
  monthly_turnover_estimate: number;
  risk_rating_internal: string;
  onboarded_date: string;
  expected_activity_profile: {
    avg_monthly_inflows: number;
    avg_monthly_outflows: number;
    primary_channels: string[];
    main_counterparty_countries: string[];
  };
}

export interface Transaction {
  tx_id: string;
  timestamp: string;
  direction: 'inflow' | 'outflow';
  amount: number;
  currency: string;
  counterparty_name: string;
  counterparty_country: string;
  payment_channel: string;
  description: string;
  invoice_reference?: string;
  is_new_counterparty: boolean;
  historical_avg_amount_for_counterparty: number;
  kyc_risk_flags: string[];
  is_related_party: boolean;
}

export interface HistoricalSummary {
  lookback_period_days: number;
  total_inflows: number;
  total_outflows: number;
  avg_txn_amount: number;
  max_txn_amount: number;
  typical_counterparty_countries: string[];
  unusual_activity_flags_last_90_days: string[];
}

export interface FraudInput {
  sme_profile: SMEProfile;
  recent_transactions: Transaction[];
  historical_summary: HistoricalSummary;
}

export interface TransactionFinding {
  tx_id: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  risk_score_0_to_100: number;
  flags: string[];
  reasoning: string;
  recommended_action: string;
}

export interface PatternAnalysis {
  anomaly_summary: string;
  suspicious_invoice_patterns: string[];
  potential_structuring_or_layering: string;
  cash_flow_risk: {
    cash_gap_risk_level: 'Low' | 'Medium' | 'High';
    reasoning: string;
  };
  financial_distress_risk_level: 'Low' | 'Medium' | 'High';
  financial_distress_reasoning: string;
}

export interface OverallAssessment {
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  primary_concern: string;
  overall_risk_score_0_to_100: number;
}

export interface Explainability {
  key_factors_in_risk_assessment: string[];
  limitations: string[];
}

export interface FraudAnalysisOutput {
  overall_assessment: OverallAssessment;
  transaction_findings: TransactionFinding[];
  pattern_analysis: PatternAnalysis;
  explainability: Explainability;
}
