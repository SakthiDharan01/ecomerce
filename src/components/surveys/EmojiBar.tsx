"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export type EmojiOption = {
  icon: string;
  value: string;
  label?: string;
};

type EmojiBarProps = {
  question?: string;
  options?: EmojiOption[];
  onSelect: (value: string) => void;
  initialValue?: string;
  className?: string;
};

const defaultOptions: EmojiOption[] = [
  { icon: "😍", value: "love", label: "Love it" },
  { icon: "🔥", value: "hot", label: "Exciting" },
  { icon: "🤔", value: "thinking", label: "Not sure" },
  { icon: "👎", value: "dislike", label: "Not for me" },
];

export default function EmojiBar({
  question = "How do you feel about this product?",
  options = defaultOptions,
  onSelect,
  initialValue,
  className = "",
}: EmojiBarProps) {
  const [selected, setSelected] = useState<string | undefined>(initialValue);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === selected),
    [options, selected],
  );

  return (
    <div
      className={`rounded-3xl border border-white/30 bg-white/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl ${className}`}
    >
      <p className="text-sm font-medium text-zinc-700">{question}</p>

      <div className="relative mt-4 grid grid-cols-4 gap-2 rounded-2xl bg-white/70 p-2">
        {selectedIndex >= 0 ? (
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="absolute top-2 h-[calc(100%-16px)] w-[calc(25%-8px)] rounded-xl bg-zinc-900"
            style={{ left: `calc(${selectedIndex * 25}% + 8px)` }}
          />
        ) : null}

        {options.map((option) => {
          const isActive = selected === option.value;

          return (
            <motion.button
              key={option.value}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelected(option.value);
                onSelect(option.value);
              }}
              className={`relative z-10 flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center transition-colors ${
                isActive ? "text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
              aria-label={option.label ?? option.value}
            >
              <motion.span
                animate={isActive ? { rotate: [0, -8, 8, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.28 }}
                className="text-2xl"
              >
                {option.icon}
              </motion.span>
              {option.label ? (
                <span className="text-[11px] font-medium leading-tight">{option.label}</span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
