import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Loader2, AlertTriangle, BrainCircuit, Sparkles } from 'lucide-react';
import RoleSelection from './components/RoleSelection';
import QuestionCard from './components/QuestionCard';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [step, setStep] = useState('setup'); // 'setup' | 'interview' | 'results'
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionSource, setQuestionSource] = useState('fallback-bank');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: 'user text' }
  const [evaluationData, setEvaluationData] = useState(null);
  
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
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
    setEvaluationData(null);

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

  const handleSubmitAllAnswers = async () => {
    setEvaluating(true);
    setErrorMsg(null);

    const qaPairs = questions.map(q => ({
      questionId: q.id,
      questionText: q.text,
      category: q.category,
      answerText: answers[q.id] || ''
    }));

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: interviewConfig.role.title,
          difficulty: interviewConfig.difficulty,
          qaPairs
        })
      });

      if (!res.ok) throw new Error(`Evaluation failed with status ${res.status}`);
      const evalResult = await res.json();

      setEvaluationData(evalResult);
      setStep('results');
    } catch (err) {
      console.error('Evaluation error:', err);
      setErrorMsg('Failed to evaluate answers. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    setStep('setup');
    setInterviewConfig(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setEvaluationData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Centered App Wrapper Container */}
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl space-y-8 z-10 my-auto">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3.5">
            {step !== 'setup' && (
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
                title="Back to Setup"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
            )}
            <div className="p-3 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 border border-blue-400/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AI Interview Agent
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {step === 'setup' && 'Role & Interview Setup'}
                {step === 'interview' && 'Mock Technical Interview'}
                {step === 'results' && 'AI Assessment & Final Verdict'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold">
            {health && (
              <span className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${
                health.hasApiKey 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              }`}>
                <span className={`w-2 h-2 rounded-full ${health.hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {health.hasApiKey ? 'AI Backend Ready' : 'Offline Bank Mode'}
              </span>
            )}
          </div>
        </header>

        {/* Dynamic Step View Switcher */}
        <main>
          {step === 'setup' && (
            <RoleSelection onStartInterview={handleStartInterview} />
          )}

          {evaluating && (
            <div className="p-12 bg-slate-950/80 border border-indigo-500/30 rounded-3xl text-center space-y-5 max-w-lg mx-auto shadow-2xl backdrop-blur-md animate-pulse my-6">
              <BrainCircuit className="w-12 h-12 text-indigo-400 animate-bounce mx-auto" />
              <div>
                <h3 className="text-xl font-extrabold text-white">AI Evaluator at Work</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Analyzing technical accuracy, depth, and scoring your responses out of 10...
                </p>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-1.5 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          )}

          {!evaluating && step === 'interview' && (
            <>
              {loadingQuestions && (
                <div className="p-12 bg-slate-950/80 border border-slate-800 rounded-3xl text-center space-y-4 max-w-lg mx-auto shadow-xl my-6">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                  <h3 className="text-lg font-extrabold text-white">Generating Questions...</h3>
                  <p className="text-xs text-slate-400">
                    Tailoring realistic interview questions for {interviewConfig?.role?.title} ({interviewConfig?.difficulty}).
                  </p>
                </div>
              )}

              {!loadingQuestions && errorMsg && (
                <div className="p-8 bg-slate-950 border border-red-500/30 rounded-3xl text-center space-y-4 max-w-lg mx-auto my-6">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Error</h3>
                  <p className="text-xs text-red-300">{errorMsg}</p>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
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

          {!evaluating && step === 'results' && evaluationData && (
            <ResultsDashboard
              evaluationData={evaluationData}
              onRestart={handleReset}
            />
          )}
        </main>

        {/* App Footer */}
        <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-800/80">
          AI Interview Agent • React (Vite) + Tailwind CSS v3 + Express + Gemini AI
        </footer>
      </div>
    </div>
  );
}

export default App;
