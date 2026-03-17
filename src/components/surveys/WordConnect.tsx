"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export type WordConnectQuestion = {
  question: string;
  answer: string;
};

export type WordConnectResult = {
  score: number;
  total: number;
  correct: number;
  bestStreak: number;
};

type LetterEntry = {
  letter: string;
  id: number;
  used: boolean;
};

type WordConnectProps = {
  questions: WordConnectQuestion[];
  onComplete: (result: WordConnectResult) => void;
  className?: string;
};

const BASE_POINTS = 100;
const STREAK_BONUS = 25;

function shuffleWord(value: string) {
  const letters = value.toUpperCase().split("");
  let attempts = 0;

  do {
    for (let i = letters.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[randomIndex]] = [letters[randomIndex], letters[i]];
    }
    attempts += 1;
  } while (letters.join("") === value.toUpperCase() && attempts < 10);

  return letters;
}

export default function WordConnect({ questions, onComplete, className = "" }: WordConnectProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState<LetterEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [shake, setShake] = useState(false);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!currentQuestion || completed) {
      return;
    }

    const scrambled = shuffleWord(currentQuestion.answer);
    setLetters(scrambled.map((letter, id) => ({ letter, id, used: false })));
    setSelectedIds([]);
    setFeedback("");
  }, [currentQuestion, completed]);

  const answerSlots = useMemo(() => currentQuestion?.answer.toUpperCase().split("") ?? [], [currentQuestion]);

  const selectedWord = selectedIds
    .map((id) => letters.find((item) => item.id === id)?.letter ?? "")
    .join("");

  const selectLetter = (id: number) => {
    if (!currentQuestion || selectedIds.length >= currentQuestion.answer.length) {
      return;
    }

    setLetters((prev) => prev.map((entry) => (entry.id === id ? { ...entry, used: true } : entry)));
    setSelectedIds((prev) => [...prev, id]);
    setFeedback("");
  };

  const removeLetter = (slotIndex: number) => {
    const id = selectedIds[slotIndex];
    if (id === undefined) {
      return;
    }

    setLetters((prev) => prev.map((entry) => (entry.id === id ? { ...entry, used: false } : entry)));
    setSelectedIds((prev) => prev.filter((_, index) => index !== slotIndex));
    setFeedback("");
  };

  const clearAnswer = () => {
    setLetters((prev) => prev.map((entry) => ({ ...entry, used: false })));
    setSelectedIds([]);
    setFeedback("");
  };

  const checkAnswer = () => {
    if (!currentQuestion) {
      return;
    }

    const expected = currentQuestion.answer.toUpperCase();

    if (selectedWord.length < expected.length) {
      setFeedback("Fill all letters first.");
      return;
    }

    if (selectedWord === expected) {
      const nextStreak = streak + 1;
      const earned = BASE_POINTS + (nextStreak > 1 ? STREAK_BONUS * (nextStreak - 1) : 0);
      const nextIndex = currentIndex + 1;

      setScore((prev) => prev + earned);
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      setCorrectCount((prev) => prev + 1);
      setFeedback(`Correct! +${earned}`);

      setTimeout(() => {
        if (nextIndex >= total) {
          const result: WordConnectResult = {
            score: score + earned,
            total,
            correct: correctCount + 1,
            bestStreak: Math.max(bestStreak, nextStreak),
          };

          setCompleted(true);
          onComplete(result);
          return;
        }

        setCurrentIndex(nextIndex);
      }, 700);

      return;
    }

    setStreak(0);
    setFeedback("Try again");
    setShake(true);
    setTimeout(() => setShake(false), 350);
  };

  const restart = () => {
    setCurrentIndex(0);
    setLetters([]);
    setSelectedIds([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setFeedback("");
    setCompleted(false);
  };

  if (!questions.length) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        No questions provided for WordConnect.
      </div>
    );
  }

  const progress = completed ? 100 : ((currentIndex + 1) / total) * 100;
  const wheelCenter = 110;
  const wheelRadius = 82;

  return (
    <div
      className={`w-full max-w-xl rounded-3xl border border-white/30 bg-white/75 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-zinc-900">Word Connect</h3>
        <div className="text-right text-xs text-zinc-500">
          <p>Score: {score}</p>
          <p>Streak: {streak}</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="h-full rounded-full bg-zinc-900"
        />
      </div>

      {completed ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4 rounded-2xl bg-white/90 p-6 text-center"
        >
          <p className="text-2xl font-semibold text-zinc-900">Puzzle Completed 🎉</p>
          <p className="text-sm text-zinc-600">
            Correct: {correctCount}/{total} · Best streak: {bestStreak}
          </p>
          <button
            onClick={restart}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Play Again
          </button>
        </motion.div>
      ) : (
        <>
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Question {currentIndex + 1} / {total}
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-800">{currentQuestion?.question}</p>
          </div>

          <motion.div
            animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.32 }}
            className="mt-4 flex min-h-14 flex-wrap items-center justify-center gap-2"
          >
            {answerSlots.map((_, slotIndex) => {
              const selectedId = selectedIds[slotIndex];
              const letter = selectedId !== undefined ? letters.find((item) => item.id === selectedId)?.letter : "";

              return (
                <button
                  key={`slot-${slotIndex}`}
                  onClick={() => letter && removeLetter(slotIndex)}
                  className={`h-11 w-11 rounded-xl border-2 text-sm font-semibold transition ${
                    letter
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 bg-white text-zinc-400"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </motion.div>

          <div className="relative mx-auto mt-6 h-[220px] w-[220px]">
            {letters.map((entry, index) => {
              const angle = (2 * Math.PI * index) / letters.length - Math.PI / 2;
              const x = wheelCenter + wheelRadius * Math.cos(angle);
              const y = wheelCenter + wheelRadius * Math.sin(angle);

              return (
                <button
                  key={entry.id}
                  disabled={entry.used}
                  onClick={() => selectLetter(entry.id)}
                  style={{ left: `${x}px`, top: `${y}px`, transform: "translate(-50%, -50%)" }}
                  className="absolute z-10 h-12 w-12 rounded-full bg-zinc-900 text-base font-semibold text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-25"
                >
                  {entry.letter}
                </button>
              );
            })}

            <button
              onClick={clearAnswer}
              className="absolute left-1/2 top-1/2 z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-100 text-lg font-bold text-zinc-700 shadow"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={clearAnswer}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
            >
              Clear
            </button>
            <button
              onClick={checkAnswer}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Submit
            </button>
          </div>

          <p className="mt-3 min-h-5 text-center text-sm text-zinc-600">{feedback}</p>
        </>
      )}
    </div>
  );
}
