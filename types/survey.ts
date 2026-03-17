export type BackendSurvey = {
  id: number;
  question: string;
  type: string;
  format?: string;
  priority?: number;
};

export type EventApiResponse = {
  survey: BackendSurvey | null;
};

export type SurveyListItem = {
  id: number;
  project_id: number;
  question: string;
  survey_type: string;
  trigger_event: string | null;
  placement_hint: string | null;
  priority: number;
  status: string;
};
