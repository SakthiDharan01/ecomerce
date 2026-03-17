"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/products";
import {
  submitSurveyResponse,
  triggerSurveyEvent,
  type TriggeredSurveyPayload,
} from "@/lib/surveyApi";
import EmojiBar from "./EmojiBar";
import MicroPopup from "./MicroPopup";
import QuickTaps from "./QuickTaps";
import SliderScale from "./SliderScale";
import SpinWheel from "./SpinWheel";
import SwipeCard from "./SwipeCard";
import WordConnect from "./WordConnect";

type SurveyKind = "emoji" | "quick" | "slider" | "spin" | "swipe" | "wordconnect" | "micro";

type EventConfig = {
  eventName: "product_view" | "checkout_started" | "search_used";
  mode: "floating" | "center";
};

function mapPathToEvent(pathname: string): EventConfig | null {
  if (pathname === "/" || pathname === "/products" || pathname.startsWith("/product/")) {
    return { eventName: "product_view", mode: "floating" };
  }

  if (pathname === "/cart" || pathname === "/checkout" || pathname === "/success") {
    return { eventName: "checkout_started", mode: "center" };
  }

  return { eventName: "search_used", mode: "floating" };
}

function normalizeSurveyType(type: string): SurveyKind {
  const normalized = type.replace(/[\s_-]/g, "").toLowerCase();

  if (normalized.includes("emoji") || normalized.includes("reaction")) {
    return "emoji";
  }
  if (normalized.includes("popup") || normalized.includes("micro")) {
    return "micro";
  }
  if (normalized.includes("quick") || normalized.includes("tap") || normalized.includes("choice")) {
    return "quick";
  }
  if (normalized.includes("slider") || normalized.includes("scale") || normalized.includes("rating")) {
    return "slider";
  }
  if (normalized.includes("spin") || normalized.includes("wheel")) {
    return "spin";
  }
  if (normalized.includes("swipe") || normalized.includes("yesno")) {
    return "swipe";
  }
  if (normalized.includes("word") || normalized.includes("puzzle")) {
    return "wordconnect";
  }

  return "quick";
}

function getModeForSurvey(kind: SurveyKind, fallback: EventConfig["mode"]): EventConfig["mode"] {
  if (kind === "swipe" || kind === "spin" || kind === "wordconnect") {
    return "center";
  }

  if (kind === "micro") {
    return "floating";
  }

  return fallback;
}

function getOrCreateUserIdentifier(): string {
  const storageKey = "survey_user_identifier";
  const existing = localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const generated = `ecom-${crypto.randomUUID()}`;
  localStorage.setItem(storageKey, generated);
  return generated;
}

function buildWordConnectQuestions(question: string) {
  const words = question
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length >= 4 && word.length <= 8);

  const dynamicAnswer = words[0] ?? "VALUE";

  return [
    { question, answer: dynamicAnswer },
    { question: "What should checkout communication always be?", answer: "CLEAR" },
    { question: "What keeps customers coming back?", answer: "TRUST" },
  ];
}

export default function SurveyRoutePopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [backendSurvey, setBackendSurvey] = useState<TriggeredSurveyPayload | null>(null);

  const eventConfig = useMemo(() => mapPathToEvent(pathname), [pathname]);
  const surveyKind = useMemo(
    () => normalizeSurveyType(backendSurvey?.type ?? "quick"),
    [backendSurvey?.type],
  );
  const mode = useMemo(
    () => getModeForSurvey(surveyKind, eventConfig?.mode ?? "floating"),
    [eventConfig?.mode, surveyKind],
  );

  const storageKey = `survey-dismissed:${pathname}:${backendSurvey?.id ?? "none"}`;

  useEffect(() => {
    setVisible(false);
    setBackendSurvey(null);

    if (!eventConfig) {
      return;
    }

    let active = true;

    const loadSurvey = async () => {
      try {
        const userIdentifier = getOrCreateUserIdentifier();
        const survey = await triggerSurveyEvent({
          eventName: eventConfig.eventName,
          page: pathname,
          userIdentifier,
        });

        if (!active || !survey) {
          return;
        }

        const dismissedKey = `survey-dismissed:${pathname}:${survey.id}`;
        if (sessionStorage.getItem(dismissedKey) === "1") {
          return;
        }

        setBackendSurvey(survey);
        const delayMs = Math.max(1200, 3200 - survey.priority * 350);
        setTimeout(() => {
          if (active) {
            setVisible(true);
          }
        }, delayMs);
      } catch {
        // Keep UI stable if backend is unavailable.
      }
    };

    void loadSurvey();

    return () => {
      active = false;
    };
  }, [eventConfig, pathname]);

  const closePopup = () => {
    sessionStorage.setItem(storageKey, "1");
    setVisible(false);
  };

  const submitAndClose = async (
    responseValue: string,
    componentType: string,
    responseMeta?: Record<string, unknown>,
  ) => {
    if (!backendSurvey || !eventConfig) {
      closePopup();
      return;
    }

    try {
      await submitSurveyResponse({
        surveyId: backendSurvey.id,
        responseValue,
        userIdentifier: getOrCreateUserIdentifier(),
        contextEvent: eventConfig.eventName,
        componentType,
        responseMeta: {
          page: pathname,
          survey_type: backendSurvey.type,
          ...(responseMeta ?? {}),
        },
      });
    } catch {
      // UI should continue even if API write fails.
    } finally {
      closePopup();
    }
  };

  const selectedProduct = useMemo(() => {
    if (!pathname.startsWith("/product/")) {
      return products[0];
    }

    const productId = pathname.split("/").pop() ?? "";
    return products.find((product) => product.id === productId) ?? products[0];
  }, [pathname]);

  const renderSurvey = () => {
    if (!backendSurvey) {
      return null;
    }

    switch (surveyKind) {
      case "emoji":
        return (
          <EmojiBar
            question={backendSurvey.question}
            onSelect={(value) => {
              void submitAndClose(value, "EmojiBar");
            }}
          />
        );
      case "micro":
        return (
          <MicroPopup
            delayMs={0}
            question={backendSurvey.question}
            onAnswer={(value) => {
              void submitAndClose(value, "MicroPopup");
            }}
          />
        );
      case "quick":
        return (
          <QuickTaps
            question={backendSurvey.question}
            onSelect={(value) => {
              void submitAndClose(value, "QuickTaps");
            }}
          />
        );
      case "slider":
        return (
          <SliderScale
            question={backendSurvey.question}
            min={1}
            max={10}
            initialValue={7}
            onChange={(value) => {
              void submitAndClose(String(value), "SliderScale", { numeric_value: value });
            }}
          />
        );
      case "spin":
        return (
          <SpinWheel
            question={backendSurvey.question}
            surveyQuestion="Answer within time to claim your reward"
            claimTimeLimitSec={12}
            onSpinEnd={(outcome) => {
              const value = outcome.claimed
                ? `CLAIMED_${outcome.reward}%`
                : `EXPIRED_${outcome.reward}%`;
              void submitAndClose(value, "SpinWheel", outcome);
            }}
            onTimeout={() => {
              closePopup();
            }}
          />
        );
      case "swipe":
        return (
          <SwipeCard
            question={backendSurvey.question}
            productName={selectedProduct.name}
            image={selectedProduct.image}
            onFeedback={(value) => {
              void submitAndClose(value, "SwipeCard");
            }}
          />
        );
      case "wordconnect":
        return (
          <WordConnect
            questions={buildWordConnectQuestions(backendSurvey.question)}
            onComplete={(result) => {
              void submitAndClose(`WORDCONNECT_SCORE_${result.score}`, "WordConnect", result as unknown as Record<string, unknown>);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!eventConfig || !backendSurvey) {
    return null;
  }

  if (surveyKind === "micro") {
    return visible ? renderSurvey() : null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <>
          {mode === "center" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/35 p-4 backdrop-blur-[1px]"
              onClick={closePopup}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 240, damping: 24 }}
                className="mx-auto mt-[7vh] w-fit"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  onClick={closePopup}
                  className="mb-2 ml-auto block rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow"
                >
                  Close
                </button>
                {renderSurvey()}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed bottom-5 right-5 z-50 w-[min(92vw,420px)]"
            >
              <button
                onClick={closePopup}
                className="mb-2 ml-auto block rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow"
              >
                Close
              </button>
              {renderSurvey()}
            </motion.div>
          )}
        </>
      ) : null}
    </AnimatePresence>
  );
}
