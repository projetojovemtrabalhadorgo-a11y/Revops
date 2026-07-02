export interface ChannelMetric {
  id: string;
  channel: string;
  leads: number;
  sqls: number;
  clients: number;
}

export interface MetricsSummary {
  channel: string;
  leads: number;
  sqls: number;
  clients: number;
  leadToSqlRate: number; // Conversion rate in %
  sqlToClientRate: number; // Conversion rate in %
  overallRate: number; // Conversion rate in %
  efficiencyScore: "Alta" | "Média" | "Baixa" | string;
  mainBottleneck: string;
}

export interface IcpProfile {
  marketSegment: string;
  valueProposition: string;
  commonPains: string[];
  idealSectors: string[];
  revenueOpportunity?: string;
}

export interface TargetAccount {
  companyName: string;
  sector: string;
  websitePlaceholder: string;
  painHook: string;
  outreachScript: string;
}

export interface ActionStep {
  stepTitle: string;
  priority: "Alta" | "Média" | "Baixa" | string;
  description: string;
}

export interface AnalysisResponse {
  markdownReport: string;
  metricsSummary: MetricsSummary[];
  icpProfile: IcpProfile;
  prospectingKeywords: string[];
  prospectingNiches: string[];
  targetAccounts: TargetAccount[];
  actionPlan: ActionStep[];
}
