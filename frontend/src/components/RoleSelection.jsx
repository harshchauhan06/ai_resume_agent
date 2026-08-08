import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Layers, 
  Briefcase, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal
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
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> AI Powered Mock Interviewer
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Configure Your Mock Interview
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          Choose your target engineering or product role. Our AI interviewer will generate custom questions tailored to your experience level.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Role */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
            Select Target Role
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/50' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${role.gradient}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                        {role.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-base">{role.title}</h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className={isSelected ? 'text-blue-400 font-semibold' : 'text-slate-500'}>
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-700'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl">
          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              Experience Level
            </label>
            <div className="space-y-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                    selectedDifficulty === diff.id
                      ? 'bg-blue-600/10 border-blue-500 text-white font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-200">{diff.label}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{diff.desc}</p>
                  </div>
                  {selectedDifficulty === diff.id && (
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              Session Length
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {[3, 5].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    questionCount === count
                      ? 'bg-blue-600/10 border-blue-500 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl font-bold text-white">{count}</span>
                  <span className="text-xs text-slate-400 mt-1">Questions</span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-400 text-xs flex items-center gap-2 mt-4">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>AI will evaluate each answer with detailed feedback & scoring out of 10.</span>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 text-base"
          >
            Start Mock Interview
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
