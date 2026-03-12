export interface MetricData {
  label: string;
  value: number;
  color: string;
}

export const TECHNOLOGY_DISTRIBUTION: MetricData[] = [
  { label: 'Frontend', value: 40, color: '#00bfff' },
  { label: 'Backend', value: 35, color: '#9b4d96' },
  { label: 'Infrastructure', value: 15, color: '#6a5acd' },
  { label: 'AI/Automation', value: 10, color: '#ff6b6b' },
];

export const ARCHITECTURE_METRICS = {
  scalability: 95,
  performance: 92,
  maintainability: 90,
  security: 88,
  reliability: 92,
};

export const PROJECT_METRICS = {
  totalProjects: 3,
  totalTechnologies: 15,
  avgComplexity: 3.3,
  avgImpact: 4.0,
};
