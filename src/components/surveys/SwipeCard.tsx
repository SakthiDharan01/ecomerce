"use client";

import { motion, useAnimationControls, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

export type SwipeFeedback = "yes" | "no";

type SwipeCardProps = {
  question?: string;
  productName: string;
  image: string;
  onFeedback: (feedback: SwipeFeedback) => void;
  className?: string;
};

export default function SwipeCard({
  question = "Is the price reasonable?",
  productName,
  image,
  onFeedback,
  className = "",
}: SwipeCardProps) {
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const noOpacity = useTransform(x, [-150, 0], [1, 0.2]);
  const yesOpacity = useTransform(x, [0, 150], [0.2, 1]);

  const submitFeedback = async (feedback: SwipeFeedback) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    await controls.start({
      x: feedback === "yes" ? 320 : -320,
      opacity: 0,
      rotate: feedback === "yes" ? 10 : -10,
      transition: { duration: 0.28, ease: "easeOut" },
    });

    onFeedback(feedback);

    x.set(0);
    await controls.start({ x: 0, opacity: 1, rotate: 0, transition: { duration: 0 } });
    setIsSubmitting(false);
  };

  return (
    <div
      className={`w-full max-w-md overflow-hidden rounded-3xl border border-white/30 bg-white/75 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur-xl ${className}`}
    >
      <motion.div
        drag={isSubmitting ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        style={{ x, rotate }}
        animate={controls}
        onDragEnd={(_, info) => {
          if (info.offset.x > 130) {
            void submitFeedback("yes");
            return;
          }

          if (info.offset.x < -130) {
            void submitFeedback("no");
            return;
          }

          void controls.start({ x: 0, transition: { type: "spring", stiffness: 420, damping: 32 } });
        }}
        className="p-6"
      >
        <h3 className="text-center text-3xl font-semibold tracking-tight text-zinc-800">{question}</h3>

        <div className="my-6 h-px bg-zinc-200" />

        <div className="space-y-4">
          <div
            role="img"
            aria-label={productName}
            className="h-56 w-full overflow-hidden rounded-2xl bg-zinc-100 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            <span className="sr-only">{productName}</span>
          </div>
          <p className="text-center text-3xl font-semibold text-slate-500">{productName}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 border-t border-zinc-200 bg-white/70">
        <motion.button
          style={{ opacity: noOpacity }}
          whileTap={{ scale: 0.98 }}
          onClick={() => void submitFeedback("no")}
          className="border-r border-zinc-200 px-4 py-4 text-left"
        >
          <p className="text-2xl font-semibold text-rose-600">← Swipe Left</p>
          <p className="mt-1 text-4xl font-bold text-rose-600">✕ No</p>
        </motion.button>

        <motion.button
          style={{ opacity: yesOpacity }}
          whileTap={{ scale: 0.98 }}
          onClick={() => void submitFeedback("yes")}
          className="px-4 py-4 text-right"
        >
          <p className="text-2xl font-semibold text-emerald-600">Swipe Right →</p>
          <p className="mt-1 text-4xl font-bold text-emerald-600">❤ Yes</p>
        </motion.button>
      </div>
    </div>
  );
}
