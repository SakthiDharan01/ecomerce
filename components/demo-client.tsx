"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { listBackendSurveys, getClientConfig, sendEvent, submitResponse } from "@/lib/api";
import { SurveyRenderer } from "@/components/survey-templates";
import { BackendSurvey, SurveyListItem } from "@/types/survey";

const EVENT_ACTIONS = [
  { label: "View Product", eventName: "product_view" },
  { label: "Scroll Page", eventName: "page_scroll" },
  { label: "Add to Cart", eventName: "add_to_cart" },
  { label: "Checkout", eventName: "checkout" },
];

function toPreviewSurvey(item: SurveyListItem): BackendSurvey {
  return {
    id: item.id,
    question: item.question,
    type: item.survey_type,
    format: item.placement_hint || undefined,
    priority: item.priority,
  };
}

export function DemoClient() {
  const { backendUrl } = getClientConfig();

  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);
  const [activeSurvey, setActiveSurvey] = useState<BackendSurvey | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [previewSurveys, setPreviewSurveys] = useState<SurveyListItem[]>([]);
  const [selectedPreviewSurveyId, setSelectedPreviewSurveyId] = useState<number | null>(null);

  const selectedPreviewSurvey = useMemo(() => {
    if (!selectedPreviewSurveyId) return null;
    return previewSurveys.find((s) => s.id === selectedPreviewSurveyId) ?? null;
  }, [previewSurveys, selectedPreviewSurveyId]);

  function pushLog(message: string) {
    setLogs((prev) => [message, ...prev].slice(0, 10));
  }

  function toFriendlyError(error: unknown) {
    const msg = String((error as Error)?.message || "Unknown error");
    if (msg.toLowerCase().includes("failed to fetch")) {
      return `Failed to fetch (check CORS / backend URL). Backend: ${backendUrl}`;
    }
    return msg;
  }

  async function handleEvent(eventName: string) {
    setLoading(true);
    setStatus(`Sending event: ${eventName}`);
    pushLog(`→ Event: ${eventName}`);

    try {
      const { data, url } = await sendEvent(eventName);
      pushLog(`↳ API: ${url}`);

      if (!data.survey) {
        setActiveSurvey(null);
        setStatus("No survey returned for this event");
        pushLog("← No survey");
        return;
      }

      setActiveSurvey(data.survey);
      setStatus(`Survey received (${data.survey.format || data.survey.type})`);
      pushLog(`← Survey: ${data.survey.format || data.survey.type}`);
    } catch (error) {
      const msg = toFriendlyError(error);
      setStatus(`Error: ${msg}`);
      pushLog(`✖ ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(value: string) {
    if (!activeSurvey) return;

    setStatus("Submitting response...");
    pushLog(`→ Response: ${value}`);

    try {
      const { url } = await submitResponse(activeSurvey.id, value);
      pushLog(`↳ API: ${url}`);
      pushLog("✓ Response sent");
      setStatus("Response submitted ✅");
      setActiveSurvey(null);
    } catch (error) {
      const msg = toFriendlyError(error);
      setStatus(`Error: ${msg}`);
      pushLog(`✖ ${msg}`);
    }
  }

  async function loadTemplateShowcase() {
    setStatus("Loading templates from backend...");
    try {
      const { data, url } = await listBackendSurveys();
      setPreviewSurveys(data);
      setSelectedPreviewSurveyId(data[0]?.id ?? null);
      setStatus(`Loaded ${data.length} backend questions`);
      pushLog(`↳ API: ${url || "(unavailable)"}`);
    } catch (error) {
      const msg = toFriendlyError(error);
      setStatus(`Error: ${msg}`);
      pushLog(`✖ ${msg}`);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">SurveySense Ecommerce Demo</h1>
        <p className="mt-1 text-sm text-slate-600">User action → Event → Survey appears → Response sent</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
          alt="Running Shoes"
          width={1200}
          height={500}
          className="h-64 w-full rounded-xl object-cover"
          priority
        />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-4 font-semibold">Running Shoes</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Lightweight performance running shoes with breathable mesh, cushioned support, and everyday durability.
            </p>
          </div>
          <div className="text-3xl font-bold">$79</div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold">User Actions</div>
        <div className="mt-1 text-xs text-slate-500">Backend: {backendUrl}</div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {EVENT_ACTIONS.map((item) => (
            <button
              key={item.eventName}
              onClick={() => handleEvent(item.eventName)}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-600">Status: {status}</div>
      </section>

      {activeSurvey && <SurveyRenderer survey={activeSurvey} onSubmit={handleSubmit} />}

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Template Showcase (questions from backend)</h3>
            <p className="text-xs text-slate-500">Pick a backend question to demo how its template renders.</p>
          </div>
          <button
            onClick={loadTemplateShowcase}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Load Backend Questions
          </button>
        </div>

        {previewSurveys.length > 0 && (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {previewSurveys.slice(0, 10).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedPreviewSurveyId(s.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedPreviewSurveyId === s.id ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-white"
                }`}
              >
                <div className="font-medium">{s.question}</div>
                <div className="mt-1 text-xs text-slate-500">
                  type: {s.survey_type} · format: {s.placement_hint || "(from type)"}
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedPreviewSurvey && (
          <div className="mt-4">
            <SurveyRenderer survey={toPreviewSurvey(selectedPreviewSurvey)} onSubmit={handleSubmit} />
          </div>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 text-sm font-semibold">Flow Log</div>
        <ul className="space-y-1 text-xs text-slate-600">
          {logs.length === 0 ? <li>No actions yet.</li> : logs.map((line, i) => <li key={`${line}-${i}`}>{line}</li>)}
        </ul>
      </section>
    </main>
  );
}
