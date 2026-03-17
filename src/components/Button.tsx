"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseClassName =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:opacity-60";

  const variantClassName =
    variant === "primary"
      ? "bg-black text-white hover:bg-zinc-800"
      : "border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`${baseClassName} ${variantClassName} ${className}`.trim()}
      {...props}
    >
      {children}
    </motion.button>
  );
}
