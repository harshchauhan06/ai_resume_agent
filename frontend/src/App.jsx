import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import RoleSelection from './components/RoleSelection';
import QuestionCard from './components/QuestionCard';

function App() {
  const [step, setStep] = useState('setup'); // 'setup' | 'interview' | 'results'
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionSource, setQuestionSource] = useState('fallback-bank');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: 'user text' }
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Health error:', err));
  }, []);

  const handleStartInterview = async (config) => {
    setInterviewConfig(config);
    setLoadingQuestions(true);
    setErrorMsg(null);
    setStep('interview');
    setCurrentIndex(0);
    setAnswers({});

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: config.role.id,
          roleTitle: config.role.title,
          difficulty: config.difficulty,
          count: config.questionCount
        })
      });

      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();

      setQuestions(data.questions || []);
      setQuestionSource(data.source || 'fallback-bank');
    } catch (err) {
      console.error('Failed to load questions:', err);
      setErrorMsg('Failed to load questions from server. Please check backend.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSaveAnswer = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const handleSubmitAllAnswers = () => {
    console.log('Submitting answers for evaluation:', {
      config: interviewConfig,
      questions,
      answers
    });
    // In Step 5, we will call /api/evaluate endpoint!
    alert(`Step 4 Complete! Successfully recorded ${Object.keys(answers).length} answers. Proceeding to Step 5 (AI Evaluation Engine).`);
  };

  const handleReset = () => {
    setStep('setup');
    setInterviewConfig(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setErrorMsg(null);
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
              <p className="text-xs text-slate-400">Step 4: Real-Time Answer Recording</p>
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
                {health.hasApiKey ? 'AI API Active' : 'Offline Bank Active'}
              </span>
            )}
          </div>
        </header>

        {/* View Switcher */}
        <main className="py-2">
          {step === 'setup' && (
            <RoleSelection onStartInterview={handleStartInterview} />
          )}

          {step === 'interview' && (
            <>
              {loadingQuestions && (
                <div className="p-12 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-4 max-w-lg mx-auto shadow-xl">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                  <h3 className="text-lg font-bold text-white">Generating Questions...</h3>
                  <p className="text-xs text-slate-400">
                    Tailoring realistic interview questions for {interviewConfig?.role?.title} ({interviewConfig?.difficulty}).
                  </p>
                </div>
              )}

              {!loadingQuestions && errorMsg && (
                <div className="p-8 bg-slate-900 border border-red-500/30 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Error Loading Questions</h3>
                  <p className="text-xs text-red-300">{errorMsg}</p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Back to Setup
                  </button>
                </div>
              )}

              {!loadingQuestions && !errorMsg && questions.length > 0 && (
                <QuestionCard
                  questions={questions}
                  currentIndex={currentIndex}
                  onNext={(newIndex) => setCurrentIndex(prev => typeof newIndex === 'number' ? newIndex : Math.min(prev + 1, questions.length - 1))}
                  onPrev={(newIndex) => setCurrentIndex(prev => typeof newIndex === 'number' ? newIndex : Math.max(prev - 1, 0))}
                  roleTitle={interviewConfig?.role?.title}
                  difficulty={interviewConfig?.difficulty}
                  source={questionSource}
                  answers={answers}
                  onSaveAnswer={handleSaveAnswer}
                  onSubmitAll={handleSubmitAllAnswers}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 pt-8 border-t border-slate-800/40">
        AI Interview Agent • Step 4: Answer Form & Session Tracking Active
      </footer>
    </div>
  );
}

export default App;
