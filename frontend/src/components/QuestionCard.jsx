import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Sparkles, 
  Layers,
  CheckCircle2,
  PenTool,
  Send,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export default function QuestionCard({
  questions,
  currentIndex,
  onNext,
  onPrev,
  roleTitle,
  difficulty,
  source,
  answers,
  onSaveAnswer,
  onSubmitAll
}) {
  const [showHint, setShowHint] = useState(false);
  const [validationError, setValidationError] = useState('');
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = answers[currentQ?.id] || '';

  // Calculate answered count (non-empty trimmed length > 0)
  const validAnswers = Object.entries(answers).filter(([_, text]) => text && text.trim().length > 0);
  const answeredCount = validAnswers.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const isCurrentEmpty = !currentAnswer || currentAnswer.trim().length === 0;
  const isCurrentTooShort = currentAnswer.trim().length > 0 && currentAnswer.trim().length < 15;

  const handleTextChange = (e) => {
    setValidationError('');
    onSaveAnswer(currentQ.id, e.target.value);
  };

  const handleFinalSubmit = () => {
    // Check if any answers are empty or whitespace-only
    const emptyQuestionIndices = questions
      .map((q, i) => (!answers[q.id] || answers[q.id].trim().length === 0 ? i + 1 : null))
      .filter(Boolean);

    if (emptyQuestionIndices.length > 0) {
      setValidationError(`Please provide an answer for Question(s): ${emptyQuestionIndices.join(', ')} before submitting.`);
      return;
    }

    setValidationError('');
    onSubmitAll();
  };

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      {/* Top Meta Bar & Quick Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {roleTitle}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {difficulty} Level
            </span>
            {source === 'gemini-ai' ? (
              <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Gemini AI Active
              </span>
            ) : (
              <span className="px-3 py-1 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-400">
                Curated Question Bank
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className={`w-4 h-4 ${answeredCount === totalQuestions ? 'text-emerald-400' : 'text-slate-500'}`} />
              Completed Answers: <strong className="text-white font-bold">{answeredCount}</strong> / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Question Switcher Pills */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto pb-1 scrollbar-thin">
          {questions.map((q, idx) => {
            const text = answers[q.id] || '';
            const hasAnswer = text.trim().length > 0;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id || idx}
                onClick={() => {
                  setShowHint(false);
                  setValidationError('');
                  if (idx > currentIndex) onNext(idx);
                  else if (idx < currentIndex) onPrev(idx);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400/50 shadow-md shadow-blue-500/20'
                    : hasAnswer
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Q{idx + 1} {hasAnswer && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Question & Answer Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Category & Hint Toggle Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-bold uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>Category: {currentQ.category || 'Technical Assessment'}</span>
          </div>

          {currentQ.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 transition hover:bg-amber-500/20"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Answer Tip'}
            </button>
          )}
        </div>

        {/* Hint Accordion */}
        {showHint && currentQ.hint && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-amber-200 text-xs space-y-1.5 animate-fade-in">
            <p className="font-bold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Recommended Answer Focus:
            </p>
            <p className="text-amber-200/90 pl-5.5 leading-relaxed">{currentQ.hint}</p>
          </div>
        )}

        {/* Question Text */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase font-bold tracking-wider">
            Question #{currentIndex + 1}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            {currentQ.text}
          </h3>
        </div>

        {/* User Answer Textarea & Validation */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="answer-input" className="font-bold flex items-center gap-1.5 text-slate-200">
              <PenTool className="w-4 h-4 text-blue-400" />
              Your Technical Response:
            </label>
            <span className={`font-mono font-medium ${
              isCurrentEmpty ? 'text-slate-500' : isCurrentTooShort ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {currentAnswer.length} characters {isCurrentTooShort ? '(min 15 recommended)' : ''}
            </span>
          </div>

          <div className="relative">
            <textarea
              id="answer-input"
              rows={5}
              value={currentAnswer}
              onChange={handleTextChange}
              placeholder="Type your answer here... (Highlight core concepts, trade-offs, and practical examples)"
              className={`w-full bg-slate-950 border rounded-2xl p-4.5 text-sm text-slate-100 placeholder-slate-500 resize-y transition font-sans leading-relaxed outline-none ${
                isCurrentEmpty 
                  ? 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                  : isCurrentTooShort
                  ? 'border-amber-500/40 focus:border-amber-500'
                  : 'border-emerald-500/40 focus:border-emerald-500'
              }`}
            />
          </div>

          {/* Inline Empty Answer Notice */}
          {isCurrentEmpty && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              Answering this question is required before submitting for final evaluation.
            </p>
          )}

          {isCurrentTooShort && (
            <p className="text-xs text-amber-400/90 flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Short response detected. Adding more detail helps the AI provide more accurate scoring.
            </p>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 text-xs flex items-start gap-2.5 animate-fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="font-semibold">{validationError}</p>
            </div>
          )}
        </div>

        {/* Navigation & Submit Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
          <button
            onClick={() => {
              setShowHint(false);
              setValidationError('');
              onPrev();
            }}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs md:text-sm font-bold transition flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => {
                setShowHint(false);
                setValidationError('');
                onNext();
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={answeredCount === 0}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs md:text-sm font-bold transition-all duration-200 shadow-xl shadow-emerald-600/20 flex items-center gap-2.5 border border-emerald-400/30"
            >
              <Send className="w-4 h-4" />
              Submit All Answers for AI Evaluation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
