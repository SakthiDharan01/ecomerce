"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type QuickTapsProps = {
  question?: string;
  options?: string[];
  onSelect: (value: string) => void;
  initialValue?: string;
  className?: string;
};

const defaultOptions = ["Price", "Comfort", "Brand", "Durability"];

export default function QuickTaps({
  question = "What matters most to you?",
  options = defaultOptions,
  onSelect,
  initialValue,
  className = "",
}: QuickTapsProps) {
  const [selected, setSelected] = useState<string | undefined>(initialValue);

  return (
    <div
      className={`rounded-3xl border border-white/30 bg-white/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl ${className}`}
    >
      <p className="text-sm font-medium text-zinc-700">{question}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected === option;

          return (
            <motion.button
              key={option}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelected(option);
                onSelect(option);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                  : "border-zinc-300 bg-white/80 text-zinc-700 hover:border-zinc-700"
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
