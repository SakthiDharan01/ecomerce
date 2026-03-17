"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type SliderScaleProps = {
  question?: string;
  min?: number;
  max?: number;
  initialValue?: number;
  onChange: (value: number) => void;
  className?: string;
};

export default function SliderScale({
  question = "Rate this from 1 to 10",
  min = 1,
  max = 10,
  initialValue = 5,
  onChange,
  className = "",
}: SliderScaleProps) {
  const [value, setValue] = useState(initialValue);
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={`rounded-3xl border border-white/30 bg-white/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">{question}</p>
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white"
        >
          {value}
        </motion.span>
      </div>

      <div className="mt-5">
        <div className="relative h-2 rounded-full bg-zinc-200">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-zinc-900"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            setValue(nextValue);
            onChange(nextValue);
          }}
          className="mt-3 w-full accent-zinc-900"
        />

        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
