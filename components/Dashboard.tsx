import React from 'react';
import { FraudAnalysisOutput, FraudInput } from '../types';
import RiskBadge from './RiskBadge';
import TransactionCard from './TransactionCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  input: FraudInput;
  analysis: FraudAnalysisOutput;
}

const Dashboard: React.FC<DashboardProps> = ({ input, analysis }) => {
  const { overall_assessment, transaction_findings, pattern_analysis, explainability } = analysis;

  const riskScoreData = [
    { name: 'Risk', value: overall_assessment.overall_risk_score_0_to_100 },
    { name: 'Safe', value: 100 - overall_assessment.overall_risk_score_0_to_100 },
  ];

  const riskColors = ['#EF4444', '#E5E7EB']; // Red for risk, gray for safe
  
  if (overall_assessment.risk_level === 'Low') riskColors[0] = '#10B981';
  if (overall_assessment.risk_level === 'Medium') riskColors[0] = '#F59E0B';
  if (overall_assessment.risk_level === 'High') riskColors[0] = '#F97316';
  if (overall_assessment.risk_level === 'Critical') riskColors[0] = '#EF4444';

  const cashFlowData = [
    { name: 'Inflows', amount: input.historical_summary.total_inflows },
    { name: 'Outflows', amount: input.historical_summary.total_outflows },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              FraudGuard Assessment
              <RiskBadge level={overall_assessment.risk_level} className="text-sm px-3 py-1" />
            </h1>
            <p className="text-gray-500 mt-1">Analyzing {input.sme_profile.business_name} ({input.sme_profile.business_id})</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <div className="text-sm text-gray-500">Overall Risk Score</div>
                <div className="text-3xl font-bold text-gray-900">{overall_assessment.overall_risk_score_0_to_100}<span className="text-base text-gray-400 font-normal">/100</span></div>
             </div>
             <div className="h-16 w-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskScoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={riskColors[index]} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-900 uppercase tracking-wide mb-1">Primary Concern</h3>
          <p className="text-gray-800 font-medium">{overall_assessment.primary_concern}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pattern Analysis & Financials */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pattern Analysis Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pattern Analysis</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-semibold text-gray-700 block mb-1">Anomaly Summary</span>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                  {pattern_analysis.anomaly_summary || "No significant anomalies detected."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-900 uppercase mb-2">Structuring / Layering</h3>
                  <p className="text-sm text-blue-800 font-medium">{pattern_analysis.potential_structuring_or_layering}</p>
                </div>
                
                <div className={`p-4 rounded-lg border ${
                    pattern_analysis.cash_flow_risk.cash_gap_risk_level === 'High' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'
                  }`}>
                  <h3 className={`text-xs font-bold uppercase mb-2 ${
                     pattern_analysis.cash_flow_risk.cash_gap_risk_level === 'High' ? 'text-orange-900' : 'text-green-900'
                  }`}>
                    Cash Flow Risk: {pattern_analysis.cash_flow_risk.cash_gap_risk_level}
                  </h3>
                  <p className={`text-sm ${
                    pattern_analysis.cash_flow_risk.cash_gap_risk_level === 'High' ? 'text-orange-800' : 'text-green-800'
                  }`}>
                    {pattern_analysis.cash_flow_risk.reasoning}
                  </p>
                </div>
              </div>

              {pattern_analysis.suspicious_invoice_patterns.length > 0 && (
                 <div>
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Suspicious Invoices</span>
                    <ul className="list-disc pl-5 space-y-1">
                      {pattern_analysis.suspicious_invoice_patterns.map((pat, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{pat}</li>
                      ))}
                    </ul>
                 </div>
              )}
            </div>
          </div>

          {/* Explainability Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Factors & Explainability</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Risk Drivers</h3>
                  <ul className="space-y-2">
                    {explainability.key_factors_in_risk_assessment.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                   <h3 className="text-sm font-semibold text-gray-700 mb-2">SME Financial Context</h3>
                   <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cashFlowData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" style={{ fontSize: '12px', fontWeight: 500 }} width={60} />
                          <RechartsTooltip 
                             cursor={{fill: 'transparent'}}
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                            {cashFlowData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="mt-2 text-xs text-gray-500 text-center">Historical Total Inflows vs Outflows</div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Transaction List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              Recent Activity
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{input.recent_transactions.length} items</span>
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2">
              {input.recent_transactions.map((tx) => {
                const finding = transaction_findings.find(f => f.tx_id === tx.tx_id);
                return (
                  <TransactionCard key={tx.tx_id} transaction={tx} finding={finding} />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
