import { EventApiResponse, SurveyListItem } from "@/types/survey";

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const projectId = Number(process.env.NEXT_PUBLIC_PROJECT_ID || "1");
const userIdentifier = process.env.NEXT_PUBLIC_USER_IDENTIFIER || "demo_user";

const candidatePaths = (path: string) => [
  `${backendUrl}${path}`,
  `${backendUrl}/api${path}`,
];

async function postWithFallback<T>(path: string, payload: unknown): Promise<{ data: T; url: string }> {
  let lastError: Error | null = null;

  for (const url of candidatePaths(path)) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!res.ok) {
        lastError = new Error(`${url} failed (${res.status})`);
        continue;
      }

      const data = (await res.json()) as T;
      return { data, url };
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError ?? new Error("Request failed");
}

export function getClientConfig() {
  return { backendUrl, projectId, userIdentifier };
}

export async function sendEvent(eventName: string) {
  return postWithFallback<EventApiResponse>("/events", {
    project_id: projectId,
    user_identifier: userIdentifier,
    event_name: eventName,
  });
}

export async function submitResponse(surveyId: number, responseValue: string) {
  return postWithFallback("/responses", {
    survey_id: surveyId,
    user_identifier: userIdentifier,
    response_value: responseValue,
    context_event: "nextjs_demo",
  });
}

export async function listBackendSurveys() {
  for (const url of candidatePaths(`/surveys/${projectId}`)) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        continue;
      }
      return { data: (await res.json()) as SurveyListItem[], url };
    } catch {
      continue;
    }
  }
  return { data: [] as SurveyListItem[], url: "" };
}
