'use client';

import React, { useState, useEffect } from 'react';
import { getUnitTest, submitUnitTest, UnitTestDetail, TestQuestion, TestSubmitResponse } from '@/lib/api/course';
import { useUserContext } from '@/context/UserContext';
import { X, Award, CheckCircle2, XCircle, Trophy, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestPlayerModalProps {
  testId: number;
  testName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const TestPlayerModal: React.FC<TestPlayerModalProps> = ({
  testId,
  testName,
  onClose,
  onSuccess,
}) => {
  const { addXp, refreshUser } = useUserContext();
  const [testDetail, setTestDetail] = useState<UnitTestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  
  // Current question user selection state
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestSubmitResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadTest() {
      setLoading(true);
      const data = await getUnitTest(testId);
      if (isMounted) {
        setTestDetail(data);
        setLoading(false);
      }
    }
    loadTest();
    return () => {
      isMounted = false;
    };
  }, [testId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          <p className="font-extrabold text-gray-700 dark:text-gray-200">Preparing Unit Test...</p>
        </div>
      </div>
    );
  }

  if (!testDetail || testDetail.questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <XCircle className="w-12 h-12 text-red-500" />
          <p className="font-bold text-gray-700 dark:text-gray-200">Could not load test questions.</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-2xl"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentQ: TestQuestion = testDetail.questions[currentIndex];
  const isLastQuestion = currentIndex === testDetail.questions.length - 1;

  const saveCurrentAnswer = () => {
    let finalAns: any = null;
    if (currentQ.type === 'MULTIPLE_CHOICE') {
      finalAns = selectedOption;
    } else if (currentQ.type === 'TRANSLATE' || currentQ.type === 'FILL_BLANK') {
      finalAns = selectedWords.join(' ');
    } else if (currentQ.type === 'TYPE_ANSWER') {
      finalAns = typedAnswer.trim();
    } else if (currentQ.type === 'MATCH_PAIRS') {
      finalAns = matchedPairs;
    }

    const updatedAnswers = { ...answers, [currentQ.id]: finalAns };
    setAnswers(updatedAnswers);
    return updatedAnswers;
  };

  const resetSelectionState = () => {
    setSelectedOption('');
    setSelectedWords([]);
    setTypedAnswer('');
    setMatchedPairs({});
    setSelectedLeft(null);
  };

  const handleNext = async () => {
    const updatedAnswers = saveCurrentAnswer();

    if (isLastQuestion) {
      setSubmitting(true);
      const formattedAnswers = Object.entries(updatedAnswers).map(([qid, ans]) => ({
        question_id: Number(qid),
        answer: ans,
      }));

      const res = await submitUnitTest(testId, formattedAnswers);
      setSubmitting(false);

      if (res) {
        setResult(res);
        if (res.passed) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          addXp(res.xp_earned || 50);
          refreshUser();
          onSuccess();
        }
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      resetSelectionState();
    }
  };

  // If test submission completed, show score summary modal
  if (result) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-scaleIn">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl shadow-lg ${
            result.passed ? 'bg-yellow-400 text-white' : 'bg-red-500 text-white'
          }`}>
            {result.passed ? <Trophy className="w-14 h-14" /> : <XCircle className="w-14 h-14" />}
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
              {result.passed ? 'Unit Test Passed!' : 'Test Not Passed'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              You scored <span className="font-extrabold text-gray-800 dark:text-white">{result.score}</span> out of{' '}
              <span className="font-extrabold text-gray-800 dark:text-white">{result.total}</span> ({result.percentage}%)
            </p>
          </div>

          {result.passed ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 p-4 rounded-2xl text-yellow-800 dark:text-yellow-200 font-bold space-y-1">
              <div className="flex items-center justify-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span>+50 XP Earned!</span>
              </div>
              <p className="text-sm font-semibold opacity-90">Next Unit Unlocked & Ready!</p>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 p-4 rounded-2xl text-red-700 dark:text-red-300 font-semibold text-sm">
              You need 80% or higher to pass this Unit Test and unlock the next unit. Don't give up!
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-white text-lg uppercase tracking-wider shadow-md transition active:scale-98 ${
              result.passed
                ? 'bg-yellow-500 hover:bg-yellow-600 shadow-[0_4px_0_#d97706]'
                : 'bg-gray-600 hover:bg-gray-700 shadow-[0_4px_0_#374151]'
            }`}
          >
            {result.passed ? 'Continue Path' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / testDetail.questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col justify-between">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto p-4 flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
          <div
            className="bg-yellow-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-400 text-sm">
          <Trophy className="w-5 h-5" />
          <span>{testName}</span>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-center space-y-8 overflow-y-auto">
        <div className="space-y-2">
          <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">
            Question {currentIndex + 1} of {testDetail.questions.length}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">
            {currentQ.question}
          </h2>
        </div>

        {/* MULTIPLE CHOICE */}
        {currentQ.type === 'MULTIPLE_CHOICE' && currentQ.options && (
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(opt)}
                className={`p-4 rounded-2xl border-2 text-left font-bold text-lg transition ${
                  selectedOption === opt
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-200 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* TRANSLATE / FILL_BLANK */}
        {(currentQ.type === 'TRANSLATE' || currentQ.type === 'FILL_BLANK') && (
          <div className="space-y-6">
            {/* Sentence Builder Display Area */}
            <div className="min-h-16 p-4 border-b-2 border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center">
              {currentQ.sentence_prefix && (
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {currentQ.sentence_prefix}
                </span>
              )}

              {selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWords((prev) => prev.filter((_, i) => i !== idx))}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-800 dark:text-white shadow-sm hover:border-red-400 transition"
                >
                  {word}
                </button>
              ))}

              {currentQ.sentence_suffix && (
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {currentQ.sentence_suffix}
                </span>
              )}
            </div>

            {/* Word Bank */}
            {currentQ.word_bank && (
              <div className="flex flex-wrap gap-2 justify-center">
                {currentQ.word_bank.map((word, idx) => {
                  const isUsed = selectedWords.includes(word);
                  return (
                    <button
                      key={idx}
                      disabled={isUsed}
                      onClick={() => setSelectedWords((prev) => [...prev, word])}
                      className={`px-4 py-3 rounded-xl border-2 font-bold text-md transition ${
                        isUsed
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-800 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-yellow-500 text-gray-800 dark:text-white shadow-sm active:scale-95'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TYPE ANSWER */}
        {currentQ.type === 'TYPE_ANSWER' && (
          <div>
            <textarea
              rows={3}
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold text-lg focus:outline-none focus:border-yellow-500"
            />
          </div>
        )}

        {/* MATCH PAIRS */}
        {currentQ.type === 'MATCH_PAIRS' && currentQ.pairs && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Column A</span>
              {currentQ.pairs.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedLeft(p.left)}
                  className={`w-full p-3 rounded-xl border-2 font-bold text-sm text-left transition ${
                    selectedLeft === p.left
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-200'
                      : matchedPairs[p.left]
                      ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {p.left} {matchedPairs[p.left] ? `➜ ${matchedPairs[p.left]}` : ''}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Column B</span>
              {currentQ.pairs.map((p, idx) => (
                <button
                  key={idx}
                  disabled={!selectedLeft}
                  onClick={() => {
                    if (selectedLeft) {
                      setMatchedPairs((prev) => ({ ...prev, [selectedLeft]: p.right }));
                      setSelectedLeft(null);
                    }
                  }}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-sm text-left hover:border-yellow-500 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                  {p.right}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-850">
        <div className="max-w-2xl w-full mx-auto flex items-center justify-end">
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-extrabold py-3.5 px-8 rounded-2xl shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-none transition uppercase tracking-wider text-base disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLastQuestion ? (
              <span>Submit Test</span>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
