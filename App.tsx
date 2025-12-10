import React, { useState, useEffect } from 'react';
import { DEFAULT_INPUT } from './constants';
import { FraudInput, FraudAnalysisOutput } from './types';
import { analyzeFraud } from './services/geminiService';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(DEFAULT_INPUT, null, 2));
  const [inputData, setInputData] = useState<FraudInput | null>(null);
  const [analysis, setAnalysis] = useState<FraudAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'dashboard'>('input');
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    // Check for API key on mount
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleAnalyze = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const parsedData = JSON.parse(jsonInput) as FraudInput;
      // Basic validation
      if (!parsedData.sme_profile || !parsedData.recent_transactions) {
        throw new Error("Invalid JSON structure. Missing 'sme_profile' or 'recent_transactions'.");
      }
      setInputData(parsedData);
      
      const result = await analyzeFraud(parsedData);
      setAnalysis(result);
      setActiveTab('dashboard');
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                 <div className="bg-indigo-500 h-8 w-8 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                 </div>
                 <span className="font-bold text-white text-xl tracking-tight">FraudGuard AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('input')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'input' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                Data Input
              </button>
              <button 
                onClick={() => {
                    if (analysis) setActiveTab('dashboard');
                }}
                disabled={!analysis}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed'}`}
              >
                Analysis Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {apiKeyMissing && (
             <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      API Key missing. Please restart the environment with a valid API Key.
                    </p>
                  </div>
                </div>
             </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-md animate-fade-in-down">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'input' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Transaction Data Input</h2>
                  <p className="text-sm text-gray-500 mt-1">Paste your SME transaction JSON payload below.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setJsonInput(JSON.stringify(DEFAULT_INPUT, null, 2))}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Reset to Default
                    </button>
                    <button 
                        onClick={handleAnalyze}
                        disabled={isLoading || apiKeyMissing}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analyzing...
                            </>
                        ) : 'Analyze Risk'}
                    </button>
                </div>
            </div>
            <div className="relative">
                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-[600px] p-6 font-mono text-sm text-slate-800 focus:outline-none resize-none bg-slate-50"
                    spellCheck="false"
                />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && inputData && analysis && (
          <Dashboard input={inputData} analysis={analysis} />
        )}
      </main>
    </div>
  );
};

export default App;
