import React, { useState, useEffect } from 'react';
import { Bot, Terminal, RefreshCw, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import RoleSelection from './components/RoleSelection';

function App() {
  const [step, setStep] = useState('setup'); // 'setup' | 'interview' | 'results'
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Health error:', err));
  }, []);

  const handleStartInterview = (config) => {
    setInterviewConfig(config);
    setStep('interview');
  };

  const handleReset = () => {
    setStep('setup');
    setInterviewConfig(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto w-full space-y-8 z-10">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center space-x-3">
            {step !== 'setup' && (
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800 mr-1"
                title="Back to Setup"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AI Interview Agent
              </h1>
              <p className="text-xs text-slate-400">Step 2: Role & Interview Setup</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            {health && (
              <span className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                health.hasApiKey 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${health.hasApiKey ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                {health.hasApiKey ? 'AI Backend Online' : 'Missing API Key'}
              </span>
            )}
          </div>
        </header>

        {/* View Switcher */}
        <main className="py-2">
          {step === 'setup' && (
            <RoleSelection onStartInterview={handleStartInterview} />
          )}

          {step === 'interview' && interviewConfig && (
            <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-blue-400 uppercase font-semibold tracking-wider">
                    {interviewConfig.difficulty} • {interviewConfig.questionCount} Questions
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-0.5">
                    {interviewConfig.role.title} Interview
                  </h2>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Change Setup
                </button>
              </div>

              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800/80 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Role Configured Successfully!</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  You selected <strong className="text-slate-200">{interviewConfig.role.title}</strong> at <strong className="text-slate-200">{interviewConfig.difficulty}</strong> level with <strong className="text-slate-200">{interviewConfig.questionCount} questions</strong>.
                </p>
                <div className="pt-2 text-xs text-indigo-400 font-mono">
                  [Step 3 will load questions dynamically for this configuration]
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 pt-8 border-t border-slate-800/40">
        AI Interview Agent • Step 2: Role & Interview Setup Active
      </footer>
    </div>
  );
}

export default App;
