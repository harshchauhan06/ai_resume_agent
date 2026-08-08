import React, { useEffect, useState } from 'react';
import { Bot, CheckCircle2, XCircle, RefreshCw, Sparkles, Terminal } from 'lucide-react';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error('Health check failed:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Background subtle glow circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full space-y-8 z-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AI Interview Agent
              </h1>
              <p className="text-xs text-slate-400 font-medium">MVP Engine v1.0</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Step 1 Active
            </span>
          </div>
        </header>

        {/* Status Card */}
        <main className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
                <Terminal className="w-5 h-5 text-indigo-400" />
                Backend Connection Status
              </h2>
              <button
                onClick={checkHealth}
                disabled={loading}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-medium border border-slate-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loading && (
              <div className="p-6 text-center text-slate-400 flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                Checking connectivity to backend API...
              </div>
            )}

            {!loading && error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Backend Disconnected</h3>
                  <p className="text-xs text-red-300/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!loading && health && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">{health.message}</h3>
                    <p className="text-xs text-emerald-400/80 font-mono mt-0.5">
                      Timestamp: {health.timestamp}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                      Express Server
                    </p>
                    <p className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Running on http://localhost:5000
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                      Gemini AI Key Status
                    </p>
                    <p className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-2">
                      {health.hasApiKey ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          API Key Configured in backend/.env
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span className="text-amber-300">Key pending in backend/.env</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 pt-8 border-t border-slate-800/40">
        AI Interview Agent • Step 1: Initialization & Environment Setup Complete
      </footer>
    </div>
  );
}

export default App;
