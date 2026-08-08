import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  Award,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Zap,
  Target,
  UserCheck,
  UserX,
  HelpCircle
} from 'lucide-react';

export default function ResultsDashboard({ evaluationData, onRestart }) {
  const { 
    overallScore, 
    overallSummary, 
    evaluations, 
    roleTitle, 
    difficulty, 
    source,
    verdict = 'MAYBE',
    verdictReason
  } = evaluationData;

  const [expandedIndex, setExpandedIndex] = useState(0);

  // Helper for final hiring verdict visual styling
  const getVerdictStyle = (v) => {
    switch (v?.toUpperCase()) {
      case 'HIRE':
        return {
          label: 'HIRE',
          subLabel: 'STRONG PASS',
          icon: UserCheck,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badgeBg: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
        };
      case 'REJECT':
        return {
          label: 'REJECT',
          subLabel: 'NEEDS PREPARATION',
          icon: UserX,
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          badgeBg: 'bg-red-500 text-white shadow-lg shadow-red-500/20'
        };
      default:
        return {
          label: 'MAYBE',
          subLabel: 'CONDITIONAL PASS',
          icon: HelpCircle,
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          badgeBg: 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
        };
    }
  };

  const verdictConfig = getVerdictStyle(verdict);
  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      {/* Hero Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {roleTitle}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {difficulty} Level
              </span>
              {source === 'gemini-ai' && (
                <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Gemini AI Graded
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Interview Assessment Report</h2>
          </div>

          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/20 border border-blue-400/20"
          >
            <RotateCcw className="w-4 h-4" />
            Start New Interview
          </button>
        </div>

        {/* Score & Verdict Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Final Verdict Card */}
          <div className={`p-6 border rounded-2xl flex flex-col items-center justify-center text-center space-y-2 relative ${verdictConfig.bg}`}>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Final Hiring Verdict</span>
            <div className="flex items-center gap-2 py-1">
              <VerdictIcon className="w-8 h-8" />
              <span className={`px-4 py-1.5 rounded-xl text-2xl font-black ${verdictConfig.badgeBg}`}>
                {verdictConfig.label}
              </span>
            </div>
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-90">
              {verdictConfig.subLabel}
            </span>
          </div>

          {/* Overall Score */}
          <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall Score</span>
            <div className="text-4xl font-black text-white flex items-baseline gap-1">
              {overallScore} <span className="text-base text-slate-500 font-normal">/ 10</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Average across {evaluations?.length || 0} questions
            </span>
          </div>

          {/* AI Executive Summary */}
          <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                <Target className="w-4 h-4" /> Hiring Recommendation
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {verdictReason || overallSummary}
              </p>
            </div>
            <div className="pt-3 text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-800/60">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Review detailed per-question breakdown below.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Per-Question Feedback Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-400" />
          Detailed Question Breakdown & AI Evaluation
        </h3>

        <div className="space-y-4">
          {evaluations.map((ev, idx) => {
            const isExpanded = expandedIndex === idx;
            const score = ev.score || 7;

            return (
              <div
                key={ev.questionId || idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition shadow-lg"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                  className="p-5 md:p-6 cursor-pointer flex items-center justify-between hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
                      Q{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-indigo-400 font-bold mb-0.5 uppercase tracking-wider">
                        <span>{ev.category || 'Technical Assessment'}</span>
                      </div>
                      <h4 className="font-bold text-white text-base line-clamp-1">
                        {ev.questionText || `Question #${idx + 1}`}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-base font-black text-white">{score}/10</span>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${
                        score >= 8 ? 'text-emerald-400' : score >= 6 ? 'text-blue-400' : 'text-amber-400'
                      }`}>
                        {ev.status || (score >= 8 ? 'Excellent' : 'Good')}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 bg-slate-950/70 border-t border-slate-800 space-y-5 animate-fade-in">
                    {/* Full Question & User Answer */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question</span>
                        <p className="text-sm font-semibold text-white mt-0.5 leading-relaxed">{ev.questionText}</p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Candidate Answer
                        </span>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-wrap mt-1 font-sans leading-relaxed">
                          {ev.userAnswer || <em className="text-slate-500">No answer provided.</em>}
                        </div>
                      </div>
                    </div>

                    {/* AI Feedback Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths
                        </span>
                        <ul className="space-y-1.5 text-xs text-emerald-200/90 pl-1">
                          {ev.strengths && ev.strengths.length > 0 ? (
                            ev.strengths.map((str, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{str}</span>
                              </li>
                            ))
                          ) : (
                            <li>Covered fundamental points.</li>
                          )}
                        </ul>
                      </div>

                      {/* Missing Points / Improvements */}
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-400" /> Areas for Improvement
                        </span>
                        <ul className="space-y-1.5 text-xs text-amber-200/90 pl-1">
                          {ev.missingPoints && ev.missingPoints.length > 0 ? (
                            ev.missingPoints.map((mp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{mp}</span>
                              </li>
                            ))
                          ) : (
                            <li>Discuss edge case optimization strategies.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Summary Feedback */}
                    {ev.summaryFeedback && (
                      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 italic">
                        "{ev.summaryFeedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
