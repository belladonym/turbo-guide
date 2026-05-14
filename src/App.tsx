/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  ChevronRight, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  Menu,
  X,
  FileText,
  Star
} from "lucide-react";
import { QUESTIONS, Question } from "./data/questions";
import { cn } from "./lib/utils";

type AppState = "LANDING" | "PRACTICE" | "EXAM" | "RESULTS";

export default function App() {
  const [state, setState] = useState<AppState>("LANDING");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [examTimeRemaining, setExamTimeRemaining] = useState(90 * 60); // 90 minutes
  const [showExplanation, setShowExplanation] = useState(false);

  // Filtered questions for practice mode topic selection (optional feature)
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === "EXAM" && examTimeRemaining > 0) {
      timer = setInterval(() => {
        setExamTimeRemaining(prev => {
          if (prev <= 1) {
            setState("RESULTS");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state, examTimeRemaining]);

  const startPractice = () => {
    setActiveQuestions([...QUESTIONS]);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setState("PRACTICE");
    setShowExplanation(false);
  };

  const startExam = () => {
    // Shuffle questions for exam?
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setActiveQuestions(shuffled);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setExamTimeRemaining(90 * 60);
    setState("EXAM");
    setShowExplanation(false);
  };

  const handleAnswer = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
    if (state === "PRACTICE") {
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setShowExplanation(false);
    } else {
      setState("RESULTS");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    return {
      correct,
      total: activeQuestions.length,
      percentage: Math.round((correct / activeQuestions.length) * 100)
    };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Navigation */}
      <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setState("LANDING")}
        >
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-lg leading-none">E</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-800">Empire State Prep</h1>
        </div>
        
        {state !== "LANDING" && state !== "RESULTS" && (
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Time Remaining</span>
              <span className="text-xl font-mono font-medium text-slate-700">
                {state === "EXAM" ? formatTime(examTimeRemaining) : "--:--"}
              </span>
            </div>
            <button 
              onClick={() => setState("LANDING")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Exit session
            </button>
          </div>
        )}
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {state === "LANDING" && (
            <motion.main 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto flex items-center justify-center p-12"
            >
              <div className="max-w-4xl w-full text-center space-y-12">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                    Real Estate Salesperson Exam
                  </span>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                    The Modern Way to <br /> Study for <span className="text-blue-600">New York</span>
                  </h2>
                  <p className="max-w-md mx-auto text-slate-500 font-medium leading-relaxed italic">
                    Prepare for your license with 75 curated questions, detailed explanations, and authentic exam simulations.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6">
                  <button 
                    onClick={startPractice}
                    className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all text-left flex flex-col gap-6"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Star className="w-6 h-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-slate-800">Practice Mode</h3>
                      <p className="text-sm text-slate-500">Learn with immediate feedback and detailed rationales.</p>
                    </div>
                  </button>

                  <button 
                    onClick={startExam}
                    className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all text-left flex flex-col gap-6"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                      <FileText className="w-6 h-6 text-slate-600 group-hover:text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-slate-800">Mock Exam</h3>
                      <p className="text-sm text-slate-500">A full 75-question timed simulation of the state test.</p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-12 pt-12 border-t border-slate-100">
                  {[
                    { label: "Questions", value: "75+" },
                    { label: "Pass Mark", value: "70%" },
                    { label: "State Focus", value: "NY" }
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.main>
          )}

          {(state === "PRACTICE" || state === "EXAM") && activeQuestions[currentQuestionIdx] && (
            <div className="flex-1 flex overflow-hidden">
              {/* Question Navigator Sidebar */}
              <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Question Navigator</h2>
                  <div className="grid grid-cols-6 gap-2">
                    {activeQuestions.map((_, idx) => {
                      const isAnswered = answers[idx] !== undefined;
                      const isCurrent = currentQuestionIdx === idx;
                      return (
                        <div 
                          key={idx}
                          onClick={() => {
                            setCurrentQuestionIdx(idx);
                            setShowExplanation(state === "PRACTICE" && answers[idx] !== undefined);
                          }}
                          className={cn(
                            "w-8 h-8 rounded text-xs font-medium flex items-center justify-center cursor-pointer border transition-all",
                            isCurrent && "bg-blue-600 text-white font-bold border-blue-600 shadow-sm",
                            !isCurrent && isAnswered && "bg-blue-50 text-blue-600 border-blue-100",
                            !isCurrent && !isAnswered && "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
                          )}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-500 uppercase font-bold tracking-wider">Progress</span>
                    <span className="font-bold text-slate-700">{Math.round((Object.keys(answers).length / activeQuestions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${(Object.keys(answers).length / activeQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </aside>

              {/* Main Question Area */}
              <section className="flex-1 flex flex-col bg-white">
                <motion.div 
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 overflow-y-auto p-12 flex flex-col items-center"
                >
                  <div className="max-w-2xl w-full space-y-10">
                    <div className="space-y-4">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                        Lesson: {activeQuestions[currentQuestionIdx].category}
                      </span>
                      <h3 className="text-3xl font-semibold text-slate-800 leading-tight">
                        {activeQuestions[currentQuestionIdx].question}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {activeQuestions[currentQuestionIdx].options.map((option, idx) => {
                        const isSelected = answers[currentQuestionIdx] === idx;
                        const isCorrect = idx === activeQuestions[currentQuestionIdx].correctAnswer;
                        const showResult = state === "PRACTICE" && answers[currentQuestionIdx] !== undefined;
                        const label = ["A", "B", "C", "D"][idx];

                        return (
                          <button
                            key={idx}
                            disabled={answers[currentQuestionIdx] !== undefined}
                            onClick={() => handleAnswer(idx)}
                            className={cn(
                              "w-full flex items-center p-4 bg-white border border-slate-200 rounded-xl transition-all text-left group",
                              !showResult && "hover:border-blue-400 hover:bg-blue-50/50",
                              !showResult && isSelected && "border-blue-600 bg-blue-50/50",
                              showResult && isCorrect && "bg-emerald-50 border-emerald-500 text-emerald-900",
                              showResult && isSelected && !isCorrect && "bg-rose-50 border-rose-500 text-rose-900",
                              showResult && !isCorrect && !isSelected && "opacity-40 grayscale"
                            )}
                          >
                            <span className={cn(
                              "w-8 h-8 rounded-full border flex items-center justify-center mr-4 text-sm font-bold transition-colors",
                              !showResult && isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-600",
                              showResult && isCorrect && "bg-emerald-500 border-emerald-500 text-white",
                              showResult && isSelected && !isCorrect && "bg-rose-500 border-rose-500 text-white"
                            )}>
                              {label}
                            </span>
                            <span className="text-slate-700 font-medium">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Key Rationale</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                          {activeQuestions[currentQuestionIdx].explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Footer Controls */}
                <div className="h-20 border-t border-slate-200 flex items-center justify-between px-12 bg-white shrink-0">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => {
                      setCurrentQuestionIdx(prev => prev - 1);
                      setShowExplanation(state === "PRACTICE" && answers[currentQuestionIdx - 1] !== undefined);
                    }}
                    className="text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 disabled:opacity-0"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Previous
                  </button>

                  <div className="flex gap-4">
                    <button 
                      className="border border-slate-200 text-slate-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                      onClick={() => {/* Feature: Flag for review */}}
                    >
                      Flag for Review
                    </button>
                    <button
                      disabled={answers[currentQuestionIdx] === undefined}
                      onClick={nextQuestion}
                      className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      {currentQuestionIdx === activeQuestions.length - 1 ? "Complete Exam" : "Submit & Next"}
                    </button>
                  </div>
                </div>
              </section>

              {/* Session Stats Sidebar */}
              <aside className="w-64 bg-slate-50 border-l border-slate-200 p-6 shrink-0 hidden lg:block overflow-y-auto">
                <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6">Session Context</h2>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Answered</p>
                    <p className="text-2xl font-bold text-slate-800">{Object.keys(answers).length} / {activeQuestions.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Session Type</p>
                    <p className="text-lg font-bold text-slate-800">{state === "EXAM" ? "Mock Exam" : "Practice"}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3 text-center sm:text-left">Empire Tip</h4>
                    <p className="text-xs leading-relaxed text-slate-500 text-center sm:text-left">
                      The NY Department of State focuses heavily on <strong>Article 12-A</strong>. Most agency questions center around the <strong>disclosure form</strong>.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {state === "RESULTS" && (
            <motion.main 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 overflow-y-auto p-12"
            >
              <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">Performance Summary</h2>
                  <p className="text-slate-500 font-medium">Detailed breakdown of your exam attempt.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total Score</div>
                    <div className={cn(
                      "text-5xl font-bold",
                      calculateScore().percentage >= 70 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {calculateScore().percentage}%
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Correct</div>
                    <div className="text-4xl font-bold text-slate-800">{calculateScore().correct} / {calculateScore().total}</div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Status</div>
                    <div className={cn(
                      "text-xl font-bold uppercase tracking-wider",
                      calculateScore().percentage >= 70 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {calculateScore().percentage >= 70 ? "Passed" : "Retake Suggested"}
                    </div>
                  </div>
                </div>

                {/* Topic Breakdown */}
                <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200 space-y-8">
                  <h3 className="text-lg font-bold text-slate-800">Domain Performance Analysis</h3>
                  <div className="grid gap-6">
                    {Object.entries(
                      activeQuestions.reduce((acc, q, idx) => {
                        const cat = q.category;
                        if (!acc[cat]) acc[cat] = { correct: 0, total: 0 };
                        acc[cat].total++;
                        if (answers[idx] === q.correctAnswer) acc[cat].correct++;
                        return acc;
                      }, {} as Record<string, { correct: number; total: number }>)
                    ).map(([category, stats]) => {
                      const perc = Math.round((stats.correct / stats.total) * 100);
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-slate-400">{category}</span>
                            <span className="text-slate-800">{stats.correct} / {stats.total} ({perc}%)</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-1000",
                                perc >= 70 ? "bg-emerald-500" : "bg-rose-400"
                              )}
                              style={{ width: `${perc}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question Review List */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800">Answer Key Review</h3>
                  <div className="grid gap-4">
                    {activeQuestions.map((q, idx) => {
                      const isCorrect = answers[idx] === q.correctAnswer;
                      return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Question {idx + 1}</span>
                              <h4 className="font-semibold text-slate-800 leading-relaxed">{q.question}</h4>
                            </div>
                            {isCorrect ? (
                              <div className="shrink-0 w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                            ) : (
                              <div className="shrink-0 w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                                <XCircle className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          
                          {!isCorrect && (
                            <div className="grid sm:grid-cols-2 gap-3 text-xs font-medium">
                              <div className="p-4 bg-emerald-50/50 text-emerald-800 rounded-xl border border-emerald-100">
                                <span className="font-bold uppercase tracking-wider block mb-1 opacity-60">Correct Answer</span>
                                {q.options[q.correctAnswer]}
                              </div>
                              {answers[idx] !== undefined && (
                                <div className="p-4 bg-rose-50/50 text-rose-800 rounded-xl border border-rose-100">
                                  <span className="font-bold uppercase tracking-wider block mb-1 opacity-60">Your Selection</span>
                                  {q.options[answers[idx]]}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="pt-4 border-t border-slate-100 flex gap-3 text-xs text-slate-500 leading-relaxed italic">
                            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-300" />
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 pb-24">
                  <button 
                    onClick={() => setState("LANDING")}
                    className="w-full sm:w-auto bg-slate-900 text-white px-10 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                  >
                    Back to Dashboard
                  </button>
                  <button 
                    onClick={startExam}
                    className="w-full sm:w-auto bg-white border border-slate-200 text-slate-800 px-10 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Retake Mock Exam
                  </button>
                </div>
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
