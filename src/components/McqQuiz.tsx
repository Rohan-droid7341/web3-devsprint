"use client";

import React, { useState, useEffect } from "react";
import { QUIZ_QUESTIONS } from "@/data/quiz";
import { CheckCircle, XCircle, ArrowRight, ChevronLeft, ChevronRight, Trophy, Loader2 } from "lucide-react";

export const McqQuiz: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  useEffect(() => {
    const savedSelected = localStorage.getItem("quiz_selectedOptions");
    const savedSubmitted = localStorage.getItem("quiz_finalSubmitted");
    const savedIdx = localStorage.getItem("quiz_currentIdx");

    if (savedSelected) setSelectedOptions(JSON.parse(savedSelected));
    if (savedSubmitted) setIsQuizSubmitted(JSON.parse(savedSubmitted));
    if (savedIdx) setCurrentIdx(parseInt(savedIdx, 10));

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("quiz_selectedOptions", JSON.stringify(selectedOptions));
    localStorage.setItem("quiz_finalSubmitted", JSON.stringify(isQuizSubmitted));
    localStorage.setItem("quiz_currentIdx", currentIdx.toString());
  }, [selectedOptions, isQuizSubmitted, currentIdx, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center py-10 w-full min-h-[300px]">
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentIdx];
  const currentSelected = selectedOptions[question.id] || null;

  // Calculate Score
  let score = 0;
  QUIZ_QUESTIONS.forEach((q) => {
    if (selectedOptions[q.id] === q.correctOptionId) {
      score++;
    }
  });

  const handleSelect = (optionId: string) => {
    if (isQuizSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const handleSubmitQuiz = () => {
    const answeredCount = Object.keys(selectedOptions).length;
    if (answeredCount < QUIZ_QUESTIONS.length) {
      if (!window.confirm(`You have only answered ${answeredCount}/${QUIZ_QUESTIONS.length} questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    setIsQuizSubmitted(true);
    setCurrentIdx(0); // Take them back to start to review answers implicitly
    
    // Auto-scroll to top so they see the score
    const modalBody = document.querySelector('.overlay-body');
    if (modalBody) modalBody.scrollTop = 0;
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left font-sans pb-4">
      
      {/* Post-Submission Score Verification Card */}
      {isQuizSubmitted && (
         <div className="border rounded-xl p-6 text-center relative overflow-hidden" style={{ borderColor: "var(--primary)", backgroundColor: "rgba(212, 175, 55, 0.05)" }}>
           <div className="absolute -right-4 -top-4 opacity-5">
             <Trophy size={120} />
           </div>
           <Trophy className="mx-auto mb-4" size={48} style={{ color: "var(--primary)" }} />
           <h2 className="text-4xl font-black text-white tracking-widest mb-2">SCORE: {score} / {QUIZ_QUESTIONS.length}</h2>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Quiz Locked & Submitted</p>
           <p className="mt-2 font-black uppercase tracking-[0.15em] text-xs px-4 py-2 border rounded-lg inline-block shadow-lg" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>
             Please show this screen to the Arena Admins for manual verification
           </p>
         </div>
      )}

      {/* Quiz Header - pagination and progress */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg sticky top-0 z-10 backdrop-blur-md">
        <div className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
          Question <span className="text-white">{currentIdx + 1}</span> / {QUIZ_QUESTIONS.length}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev} 
            disabled={currentIdx === 0}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentIdx === QUIZ_QUESTIONS.length - 1}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="py-2 px-2">
        <h3 className="text-xl font-medium text-white leading-relaxed">
          {question.text}
        </h3>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {question.options.map((opt) => {
          const isSelected = currentSelected === opt.id;
          const isCorrectResponse = opt.id === question.correctOptionId;

           let bgStyle = isSelected && !isQuizSubmitted ? "rgba(212, 175, 55, 0.15)" : undefined;
           let borderStyle = isSelected && !isQuizSubmitted ? "var(--primary)" : undefined;

          // Determine styles base classes
          let optionClasses = "p-5 border rounded-2xl flex items-center gap-5 transition-all duration-300 ";
          
          if (!isQuizSubmitted) {
            optionClasses += isSelected 
              ? "text-white cursor-pointer scale-[1.01] shadow-lg " 
              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white cursor-pointer ";
          } else {
            optionClasses += "cursor-default text-opacity-80 ";
            if (isCorrectResponse) {
              optionClasses += "bg-green-500/10 border-green-500 text-green-100 ";
            } else if (isSelected && !isCorrectResponse) {
              optionClasses += "bg-red-500/10 border-red-500 text-red-100 ";
            } else {
              optionClasses += "bg-white/5 border-white/5 opacity-50 grayscale ";
            }
          }

          return (
            <div 
              key={opt.id} 
              onClick={() => handleSelect(opt.id)}
              className={optionClasses}
              style={{ backgroundColor: bgStyle, borderColor: borderStyle }}
            >
              <div 
                className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-black transition-colors ${
                  !isQuizSubmitted && isSelected ? "text-black" : 
                  !isQuizSubmitted && !isSelected ? "border-white/20 text-white/50" :
                  isQuizSubmitted && isCorrectResponse ? "border-green-500 bg-green-500 text-black" :
                  isQuizSubmitted && isSelected && !isCorrectResponse ? "border-red-500 bg-red-500 text-black" :
                  "border-white/20 text-white/30 bg-transparent"
                }`}
                style={!isQuizSubmitted && isSelected ? { backgroundColor: "var(--primary)", borderColor: "var(--primary)" } : {}}
              >
                {opt.id}
              </div>
              <div className="text-base leading-snug flex-1">
                {opt.text}
              </div>
              <div className="w-6 flex justify-end shrink-0">
                {isQuizSubmitted && isCorrectResponse && (
                  <CheckCircle className="text-green-500 animate-in zoom-in" size={24} />
                )}
                {isQuizSubmitted && isSelected && !isCorrectResponse && (
                  <XCircle className="text-red-500 animate-in zoom-in" size={24} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Area */}
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <div className="text-xs font-black tracking-[0.2em] uppercase text-gray-500">
           {!isQuizSubmitted ? (
             <span className="text-white">
               {Object.keys(selectedOptions).length} / {QUIZ_QUESTIONS.length} <span className="text-gray-500">ANSWERED</span>
             </span>
           ) : (
             <span className="flex items-center gap-2" style={{ color: "var(--primary)" }}>
               <Trophy size={14} /> LOCKED
             </span>
           )}
        </div>
        <div className="flex gap-3">
          {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-[0.15em] text-sm rounded-xl hover:bg-gray-200 hover:scale-[1.02] transition-all shadow-xl flex items-center gap-3"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            !isQuizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                className="gold-button !px-6 !py-3 flex items-center gap-2"
                style={{ display: "inline-flex" }}
              >
                SUBMIT QUIZ <CheckCircle size={18} />
              </button>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
