export type ViewKey = "overview" | "reservations" | "branding" | "devices" | "audit" | "identity";
export type Language = "en" | "pt-BR" | "es";

export type OverviewMetric = {
  label: string;
  value: string;
  detail: string;
};

export type OverviewActivity = {
  title: string;
  subtitle: string;
  meta: string;
  tone: "gold" | "neutral" | "muted";
};

export type OverviewUnit = {
  name: string;
  subtitle: string;
  status: string;
  statusTone: "good" | "warning" | "danger" | "neutral";
  metric: string;
  detail: string;
  accent: string;
};

export type TrendPoint = {
  label: string;
  value: number;
};
