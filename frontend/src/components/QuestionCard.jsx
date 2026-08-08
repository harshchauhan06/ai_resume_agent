import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Sparkles, 
  Layers,
  Award
} from 'lucide-react';

export default function QuestionCard({
  questions,
  currentIndex,
  onNext,
  onPrev,
  roleTitle,
  difficulty,
  source
}) {
  const [showHint, setShowHint] = useState(false);
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Meta Bar & Progress */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {roleTitle}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {difficulty} Level
            </span>
            {source === 'gemini-ai' ? (
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini AI Generated
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-400">
                Curated Question Bank
              </span>
            )}
          </div>

          <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Question <span className="text-white text-sm">{currentIndex + 1}</span> of {totalQuestions}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
        {/* Subtle accent tag */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Category: {currentQ.category || 'Technical Assessment'}</span>
          </div>

          {currentQ.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 transition"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Tip / Focus'}
            </button>
          )}
        </div>

        {/* Hint Accordion */}
        {showHint && currentQ.hint && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-xs space-y-1 animate-fade-in">
            <p className="font-semibold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Key Answer Focus:
            </p>
            <p className="text-amber-200/90 pl-5.5">{currentQ.hint}</p>
          </div>
        )}

        {/* Question Text */}
        <div className="space-y-2 py-2">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            {currentQ.text}
          </h3>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
          <button
            onClick={() => {
              setShowHint(false);
              onPrev();
            }}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs md:text-sm font-semibold transition flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {currentIndex + 1} / {totalQuestions}
          </span>

          <button
            onClick={() => {
              setShowHint(false);
              onNext();
            }}
            disabled={currentIndex === totalQuestions - 1}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-40"
          >
            Next Question
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
