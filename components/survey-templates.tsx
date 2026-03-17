"use client";

import { useMemo, useState } from "react";

import { BackendSurvey } from "@/types/survey";

type TemplateProps = {
  onSubmit: (value: string) => void;
};

function EmojiBar({ onSubmit }: TemplateProps) {
  return (
    <div className="flex gap-2 mt-2">
      {["😍", "🔥", "🤔", "👎"].map((e) => (
        <button key={e} className="text-2xl hover:scale-110 transition" onClick={() => onSubmit(e)}>
          {e}
        </button>
      ))}
    </div>
  );
}

function QuickTaps({ onSubmit }: TemplateProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {["Price", "Comfort", "Brand"].map((item) => (
        <button
          key={item}
          onClick={() => onSubmit(item)}
          className="rounded-full border bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function SliderScale({ onSubmit }: TemplateProps) {
  const [value, setValue] = useState(5);

  return (
    <div className="mt-2">
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full"
      />
      <div className="mt-1 text-xs text-slate-500">Selected: {value}</div>
      <button className="mt-2 rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => onSubmit(String(value))}>
        Submit
      </button>
    </div>
  );
}

function SwipeCard({ onSubmit }: TemplateProps) {
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onSubmit("NO")} className="rounded-lg border border-rose-200 bg-rose-50 py-2 text-sm text-rose-700">
          ← NO
        </button>
        <button onClick={() => onSubmit("YES")} className="rounded-lg border border-emerald-200 bg-emerald-50 py-2 text-sm text-emerald-700">
          YES →
        </button>
      </div>
    </div>
  );
}

function SpinWheel({ onSubmit }: TemplateProps) {
  return (
    <button onClick={() => onSubmit("SPIN_CLICKED")} className="mt-2 rounded-xl border border-amber-200 bg-amber-100 px-4 py-2 text-sm">
      Spin to Win 🎁
    </button>
  );
}

function WordConnect({ onSubmit }: TemplateProps) {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {["PUMA", "NIKE", "ADIDAS"].map((b) => (
        <button key={b} onClick={() => onSubmit(b)} className="rounded-lg border bg-white px-2 py-2 text-sm hover:bg-slate-50">
          {b}
        </button>
      ))}
    </div>
  );
}

function normalizeFormat(survey: BackendSurvey): string {
  const f = (survey.format || "").toLowerCase().trim();
  if (f && f !== "micro") {
    return f;
  }

  const t = (survey.type || "").toLowerCase();
  if (t.includes("emoji")) return "emoji_bar";
  if (t.includes("quick") || t.includes("tap")) return "quick_taps";
  if (t.includes("slider") || t.includes("rating")) return "slider";
  if (t.includes("swipe") || t.includes("yes") || t.includes("no")) return "swipe_card";
  if (t.includes("spin") || t.includes("reward")) return "spin_wheel";
  if (t.includes("word") || t.includes("brand")) return "word_connect";
  return "micro_popup";
}

export function SurveyRenderer({ survey, onSubmit }: { survey: BackendSurvey; onSubmit: (value: string) => void }) {
  const format = useMemo(() => normalizeFormat(survey), [survey]);

  const card = (
    <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 shadow-lg">
      <div className="text-xs text-slate-500">Survey · {survey.type || "feedback"} · {format}</div>
      <p className="mt-1 text-sm font-medium">{survey.question}</p>

      {format === "emoji_bar" && <EmojiBar onSubmit={onSubmit} />}
      {format === "quick_taps" && <QuickTaps onSubmit={onSubmit} />}
      {format === "slider" && <SliderScale onSubmit={onSubmit} />}
      {format === "swipe_card" && <SwipeCard onSubmit={onSubmit} />}
      {format === "spin_wheel" && <SpinWheel onSubmit={onSubmit} />}
      {format === "word_connect" && <WordConnect onSubmit={onSubmit} />}
      {format === "micro_popup" && <QuickTaps onSubmit={onSubmit} />}
    </div>
  );

  if (format === "micro_popup") {
    return <div className="fixed bottom-4 right-4 z-50 w-[330px] max-w-[calc(100vw-2rem)]">{card}</div>;
  }

  return <div className="mt-4">{card}</div>;
}
