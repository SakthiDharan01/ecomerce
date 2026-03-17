"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export type SpinWheelOutcome = {
  reward: number;
  claimed: boolean;
  timedOut: boolean;
  surveyChoice: string | null;
};

type SpinWheelProps = {
  rewards?: number[];
  question?: string;
  surveyQuestion?: string;
  surveyOptions?: string[];
  claimTimeLimitSec?: number;
  autoCloseAfterMs?: number;
  onSpinEnd: (outcome: SpinWheelOutcome) => void;
  onTimeout?: () => void;
  className?: string;
};

const defaultRewards = [5, 10, 15, 20, 25, 30];
const defaultSurveyOptions = ["Price", "Comfort", "Brand", "Delivery Speed"];
type ClaimStep = "idle" | "survey" | "claimed" | "expired";

export default function SpinWheel({
  rewards = defaultRewards,
  question,
  surveyQuestion = "To claim your reward, what matters most to you?",
  surveyOptions = defaultSurveyOptions,
  claimTimeLimitSec = 12,
  autoCloseAfterMs = 1500,
  onSpinEnd,
  onTimeout,
  className = "",
}: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [questionAnswered, setQuestionAnswered] = useState(!question);
  const [claimStep, setClaimStep] = useState<ClaimStep>("idle");
  const [surveyChoice, setSurveyChoice] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(claimTimeLimitSec);

  const claimCountdownRef = useRef<number | null>(null);
  const expireTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const segmentAngle = 360 / rewards.length;

  const wheelStyle = useMemo(() => {
    const step = 100 / rewards.length;
    const segments = rewards
      .map((_, index) => {
        const start = Number((index * step).toFixed(2));
        const end = Number(((index + 1) * step).toFixed(2));
        const color = index % 2 === 0 ? "#111827" : "#374151";

        return `${color} ${start}% ${end}%`;
      })
      .join(", ");

    return { background: `conic-gradient(${segments})` };
  }, [rewards]);

  const spin = () => {
    if (isSpinning || claimStep === "survey") {
      return;
    }

    setIsSpinning(true);
    setClaimStep("idle");
    setSurveyChoice(null);
    setResult(null);
    setTimeLeft(claimTimeLimitSec);

    if (claimCountdownRef.current) {
      window.clearInterval(claimCountdownRef.current);
      claimCountdownRef.current = null;
    }

    if (expireTimerRef.current) {
      window.clearTimeout(expireTimerRef.current);
      expireTimerRef.current = null;
    }

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const winnerIndex = Math.floor(Math.random() * rewards.length);
    const centerOffset = winnerIndex * segmentAngle + segmentAngle / 2;
    const target = rotation + 360 * 5 + (360 - centerOffset);

    setRotation(target);

    setTimeout(() => {
      const reward = rewards[winnerIndex];
      setResult(reward);
      setIsSpinning(false);
      setClaimStep("survey");
      setTimeLeft(claimTimeLimitSec);
    }, 3400);
  };

  const claimReward = () => {
    if (!result || claimStep !== "survey" || !surveyChoice) {
      return;
    }

    setClaimStep("claimed");

    if (claimCountdownRef.current) {
      window.clearInterval(claimCountdownRef.current);
      claimCountdownRef.current = null;
    }

    closeTimerRef.current = window.setTimeout(() => {
      onSpinEnd({
        reward: result,
        claimed: true,
        timedOut: false,
        surveyChoice,
      });
    }, autoCloseAfterMs);
  };

  useEffect(() => {
    if (claimStep !== "survey") {
      return;
    }

    claimCountdownRef.current = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          if (claimCountdownRef.current) {
            window.clearInterval(claimCountdownRef.current);
            claimCountdownRef.current = null;
          }

          setClaimStep("expired");
          expireTimerRef.current = window.setTimeout(() => {
            if (result) {
              onSpinEnd({
                reward: result,
                claimed: false,
                timedOut: true,
                surveyChoice,
              });
            }
            onTimeout?.();
          }, 1200);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      if (claimCountdownRef.current) {
        window.clearInterval(claimCountdownRef.current);
        claimCountdownRef.current = null;
      }
    };
  }, [claimStep, onSpinEnd, onTimeout, result, surveyChoice]);

  useEffect(() => {
    return () => {
      if (claimCountdownRef.current) {
        window.clearInterval(claimCountdownRef.current);
      }

      if (expireTimerRef.current) {
        window.clearTimeout(expireTimerRef.current);
      }

      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`rounded-3xl border border-white/30 bg-white/70 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl ${className}`}
    >
      <h3 className="text-center text-lg font-semibold text-zinc-800">Spin to Win</h3>

      {question && !questionAnswered ? (
        <div className="mt-4 space-y-3 rounded-2xl bg-white/80 p-4 text-center">
          <p className="text-sm text-zinc-700">{question}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setQuestionAnswered(true)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700"
            >
              Yes
            </button>
            <button
              onClick={() => setQuestionAnswered(true)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700"
            >
              No
            </button>
          </div>
        </div>
      ) : null}

      <div className="relative mx-auto mt-6 h-64 w-64">
        <div className="absolute left-1/2 top-[-8px] z-10 h-0 w-0 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-rose-500" />

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full rounded-full border-8 border-white shadow-lg"
          style={wheelStyle}
        >
          {rewards.map((reward, index) => {
            const angle = index * segmentAngle + segmentAngle / 2;
            return (
              <span
                key={reward + index}
                className="absolute left-1/2 top-1/2 text-sm font-semibold text-white"
                style={{ transform: `rotate(${angle}deg) translateY(-105px) rotate(-${angle}deg)` }}
              >
                {reward}%
              </span>
            );
          })}
        </motion.div>

        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-900 shadow">
          WIN
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || !questionAnswered || claimStep === "survey"}
        className="mt-6 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>

      {claimStep === "survey" && result !== null ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-zinc-200 bg-white/90 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-800">You unlocked {result}% OFF</p>
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
              {timeLeft}s
            </span>
          </div>

          <p className="text-sm text-zinc-700">{surveyQuestion}</p>

          <div className="grid grid-cols-2 gap-2">
            {surveyOptions.map((option) => {
              const isSelected = surveyChoice === option;
              return (
                <button
                  key={option}
                  onClick={() => setSurveyChoice(option)}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-700"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <button
            onClick={claimReward}
            disabled={!surveyChoice}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            Claim {result}% Discount
          </button>
        </div>
      ) : null}

      {claimStep === "claimed" && result !== null ? (
        <p className="mt-3 text-center text-sm font-medium text-emerald-700">
          Discount claimed: {result}% off 🎉
        </p>
      ) : null}

      {claimStep === "expired" ? (
        <p className="mt-3 text-center text-sm font-medium text-rose-600">
          Time is up. Reward expired.
        </p>
      ) : null}
    </div>
  );
}
