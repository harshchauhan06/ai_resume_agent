import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Layers, 
  Briefcase, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

const ROLES = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'React, JavaScript, CSS architecture, web performance, and modern UI engineering.',
    icon: Code2,
    badge: 'UI / UX',
    gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Node.js, databases, REST APIs, microservices, and server-side optimization.',
    icon: Server,
    badge: 'API / DB',
    gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400'
  },
  {
    id: 'fullstack',
    title: 'Fullstack Engineer',
    description: 'End-to-end web applications, system integration, databases, and client state.',
    icon: Layers,
    badge: 'End-to-End',
    gradient: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400'
  },
  {
    id: 'product',
    title: 'Product Manager',
    description: 'Product vision, feature prioritization, stakeholder alignment, and analytics.',
    icon: Briefcase,
    badge: 'Strategy',
    gradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
  },
  {
    id: 'data',
    title: 'Data Analyst',
    description: 'SQL queries, data modeling, business intelligence, and metrics design.',
    icon: BarChart3,
    badge: 'Analytics',
    gradient: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400'
  }
];

const DIFFICULTIES = [
  { id: 'Junior', label: 'Junior / Entry', desc: 'Core fundamentals & practical basics' },
  { id: 'Mid-Level', label: 'Mid-Level', desc: 'Problem solving & real-world scenarios' },
  { id: 'Senior', label: 'Senior Lead', desc: 'System design, edge cases & trade-offs' }
];

export default function RoleSelection({ onStartInterview }) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Mid-Level');
  const [questionCount, setQuestionCount] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    const roleObj = ROLES.find(r => r.id === selectedRole);
    onStartInterview({
      role: roleObj,
      difficulty: selectedDifficulty,
      questionCount: Number(questionCount)
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in py-2">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold shadow-sm">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" /> AI Powered Mock Interviewer
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Configure Your Mock Interview
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Select your target engineering or product role. Our AI interviewer will generate custom technical questions tailored to your experience level.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Select Role */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-md shadow-blue-500/20 font-black">1</span>
              Select Target Role
            </label>
            <span className="text-xs text-slate-500 font-medium">Choose 1 of 5 roles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between group ${
                    isSelected 
                      ? 'bg-slate-900/90 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/40 translate-y-[-2px]' 
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 hover:translate-y-[-1px]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl border bg-gradient-to-br transition-transform duration-200 group-hover:scale-105 ${role.gradient}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-400 border border-slate-700/50">
                        {role.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">{role.title}</h3>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className={`font-semibold flex items-center gap-1.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      {isSelected ? 'Selected' : 'Select role'}
                    </span>
                    <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/50' : 'border-slate-700'
                    }`}>
                      {isSelected && <span className="block w-1.5 h-1.5 bg-white rounded-full"></span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Settings (Difficulty & Question Count) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-900/70 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-xl">
          {/* Difficulty Selection */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-md shadow-blue-500/20 font-black">2</span>
              Experience Level
            </label>
            <div className="space-y-2.5">
              {DIFFICULTIES.map((diff) => (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-200 flex items-center justify-between ${
                    selectedDifficulty === diff.id
                      ? 'bg-blue-600/15 border-blue-500/80 text-white font-semibold ring-1 ring-blue-500/30'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-200 text-sm">{diff.label}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{diff.desc}</p>
                  </div>
                  {selectedDifficulty === diff.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-md shadow-blue-500/20 font-black">3</span>
              Session Length
            </label>

            <div className="grid grid-cols-2 gap-4">
              {[3, 5].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`p-5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center ${
                    questionCount === count
                      ? 'bg-blue-600/15 border-blue-500 text-white font-bold ring-1 ring-blue-500/30 shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="text-3xl font-black text-white">{count}</span>
                  <span className="text-xs text-slate-400 mt-1 font-medium">Questions</span>
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-slate-400 text-xs flex items-center gap-3 mt-4">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="leading-relaxed">AI will evaluate each answer with numerical score (0-10), strengths, areas for improvement, and final verdict.</span>
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-blue-600/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-base tracking-wide border border-blue-400/30"
          >
            Start Mock Interview
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
