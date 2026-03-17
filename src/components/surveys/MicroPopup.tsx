"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type MicroPopupAnswer = "yes" | "no";

type MicroPopupProps = {
  question?: string;
  delayMs?: number;
  yesLabel?: string;
  noLabel?: string;
  onAnswer: (value: MicroPopupAnswer) => void;
};

export default function MicroPopup({
  question = "Need help choosing the right product?",
  delayMs = 3500,
  yesLabel = "Yes",
  noLabel = "No",
  onAnswer,
}: MicroPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleAnswer = (value: MicroPopupAnswer) => {
    onAnswer(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="fixed bottom-5 right-5 z-50 w-[min(92vw,360px)] rounded-2xl border border-white/30 bg-white/85 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.18)] backdrop-blur-xl"
        >
          <p className="text-sm font-medium text-zinc-700">{question}</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnswer("no")}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
            >
              {noLabel}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnswer("yes")}
              className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              {yesLabel}
            </motion.button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
