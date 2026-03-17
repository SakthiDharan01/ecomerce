const defaultApiBaseUrl = "https://surveyaibackend.onrender.com";

export const SURVEY_API_BASE_URL = (
  process.env.NEXT_PUBLIC_SURVEY_API_BASE_URL ?? defaultApiBaseUrl
).replace(/\/$/, "");

const configuredProjectId = Number(process.env.NEXT_PUBLIC_SURVEY_PROJECT_ID ?? "");

let cachedProjectId: number | null | undefined;

export type TriggeredSurveyPayload = {
  id: number;
  question: string;
  type: string;
  format: string;
  priority: number;
};

type TriggerEventResponse = {
  survey: TriggeredSurveyPayload | null;
  reasoning?: string[];
  scored_candidates?: Array<{
    survey_id: number;
    score: number;
    reasons: string[];
  }>;
};

type Project = {
  id: number;
  name: string;
  website_url: string | null;
  repo_url: string | null;
};

type TriggerSurveyEventInput = {
  eventName: string;
  page: string;
  userIdentifier: string;
  projectId?: number;
  route?: string;
  sessionId?: string;
  timeOnPage?: number;
  scrollDepth?: number;
  cartValue?: number;
  previousResponses?: number[];
};

type SubmitSurveyResponseInput = {
  surveyId: number;
  responseValue: string;
  userIdentifier: string;
  contextEvent: string;
  sourceApp?: string;
  componentType?: string;
  responseMeta?: Record<string, unknown>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${SURVEY_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Survey API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function resolveProjectId(): Promise<number | null> {
  if (cachedProjectId !== undefined) {
    return cachedProjectId;
  }

  if (Number.isFinite(configuredProjectId) && configuredProjectId > 0) {
    cachedProjectId = configuredProjectId;
    return cachedProjectId;
  }

  try {
    const projects = await request<Project[]>("/projects");
    const matched =
      projects.find((project) =>
        [project.name, project.website_url, project.repo_url]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes("ecom")),
      ) ?? projects[0];

    cachedProjectId = matched?.id ?? null;
    return cachedProjectId;
  } catch {
    cachedProjectId = null;
    return null;
  }
}

export async function triggerSurveyEvent({
  eventName,
  page,
  userIdentifier,
  projectId,
  route,
  sessionId,
  timeOnPage,
  scrollDepth,
  cartValue,
  previousResponses,
}: TriggerSurveyEventInput): Promise<TriggeredSurveyPayload | null> {
  const resolvedProjectId = projectId ?? (await resolveProjectId());

  if (!resolvedProjectId) {
    return null;
  }

  const payload = await request<TriggerEventResponse>("/events", {
    method: "POST",
    body: JSON.stringify({
      project_id: resolvedProjectId,
      user_identifier: userIdentifier,
      event_name: eventName,
      page,
      route: route ?? page,
      session_id: sessionId,
      time_on_page: timeOnPage,
      scroll_depth: scrollDepth,
      cart_value: cartValue,
      previous_responses: previousResponses,
    }),
  });

  return payload.survey;
}

export async function submitSurveyResponse({
  surveyId,
  responseValue,
  userIdentifier,
  contextEvent,
  sourceApp = "ecomerce",
  componentType,
  responseMeta,
}: SubmitSurveyResponseInput): Promise<void> {
  await request("/responses", {
    method: "POST",
    body: JSON.stringify({
      survey_id: surveyId,
      response_value: responseValue,
      user_identifier: userIdentifier,
      context_event: contextEvent,
      source_app: sourceApp,
      component_type: componentType,
      response_meta: responseMeta,
    }),
  });
}
