export interface SkillNode {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  cluster: 'frontend' | 'backend' | 'data-infrastructure' | 'ai-automation';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface Connection {
  source: string;
  target: string;
  strength: number; // 0-1, how strongly related
}

export const NEURAL_SKILLS_DATA: SkillNode[] = [
  // Frontend Cluster
  { id: 'angular', name: 'Angular', proficiency: 95, category: 'Frontend', cluster: 'frontend' },
  { id: 'react', name: 'React', proficiency: 85, category: 'Frontend', cluster: 'frontend' },
  { id: 'typescript', name: 'TypeScript', proficiency: 92, category: 'Frontend', cluster: 'frontend' },
  { id: 'css-scss', name: 'CSS/SCSS', proficiency: 90, category: 'Frontend', cluster: 'frontend' },
  { id: 'tailwind', name: 'Tailwind', proficiency: 92, category: 'Frontend', cluster: 'frontend' },

  // Backend Cluster
  { id: 'nodejs', name: 'Node.js', proficiency: 90, category: 'Backend', cluster: 'backend' },
  { id: 'express', name: 'Express.js', proficiency: 88, category: 'Backend', cluster: 'backend' },
  { id: 'restapis', name: 'REST APIs', proficiency: 92, category: 'Backend', cluster: 'backend' },
  { id: 'auth-systems', name: 'Authentication', proficiency: 88, category: 'Backend', cluster: 'backend' },

  // Data & Infrastructure Cluster
  { id: 'postgresql', name: 'PostgreSQL', proficiency: 88, category: 'Data', cluster: 'data-infrastructure' },
  { id: 'mongodb', name: 'MongoDB', proficiency: 82, category: 'Data', cluster: 'data-infrastructure' },
  { id: 'docker', name: 'Docker', proficiency: 85, category: 'Infrastructure', cluster: 'data-infrastructure' },
  { id: 'cicd', name: 'CI/CD', proficiency: 90, category: 'Infrastructure', cluster: 'data-infrastructure' },

  // AI/Automation Cluster
  { id: 'ai-integration', name: 'AI Integration', proficiency: 85, category: 'Tools', cluster: 'ai-automation' },
  { id: 'automation', name: 'Automation', proficiency: 80, category: 'Tools', cluster: 'ai-automation' },
  { id: 'system-design', name: 'System Design', proficiency: 90, category: 'Tools', cluster: 'ai-automation' },
  { id: 'performance', name: 'Performance Opt.', proficiency: 88, category: 'Tools', cluster: 'ai-automation' },
];

export const SKILL_CONNECTIONS: Connection[] = [
  // Frontend interconnections
  { source: 'angular', target: 'typescript', strength: 0.95 },
  { source: 'react', target: 'typescript', strength: 0.9 },
  { source: 'angular', target: 'css-scss', strength: 0.8 },
  { source: 'react', target: 'css-scss', strength: 0.8 },
  { source: 'tailwind', target: 'css-scss', strength: 0.85 },
  { source: 'angular', target: 'react', strength: 0.7 },

  // Backend interconnections
  { source: 'nodejs', target: 'express', strength: 0.95 },
  { source: 'express', target: 'restapis', strength: 0.9 },
  { source: 'nodejs', target: 'auth-systems', strength: 0.85 },

  // Data interconnections
  { source: 'postgresql', target: 'docker', strength: 0.8 },
  { source: 'mongodb', target: 'docker', strength: 0.8 },
  { source: 'cicd', target: 'docker', strength: 0.85 },

  // Cross-cluster connections
  { source: 'typescript', target: 'nodejs', strength: 0.9 },
  { source: 'restapis', target: 'postgresql', strength: 0.85 },
  { source: 'angular', target: 'nodejs', strength: 0.75 },
  { source: 'react', target: 'nodejs', strength: 0.75 },
  { source: 'system-design', target: 'nodejs', strength: 0.8 },
  { source: 'system-design', target: 'postgresql', strength: 0.8 },
  { source: 'ai-integration', target: 'nodejs', strength: 0.85 },
  { source: 'automation', target: 'cicd', strength: 0.9 },
];

export const CLUSTER_POSITIONS = {
  'frontend': { cx: 300, cy: 200 },
  'backend': { cx: 700, cy: 200 },
  'data-infrastructure': { cx: 500, cy: 450 },
  'ai-automation': { cx: 500, cy: 600 },
};

export const CLUSTER_COLORS = {
  'frontend': '#00bfff',
  'backend': '#9b4d96',
  'data-infrastructure': '#00bfff',
  'ai-automation': '#9b4d96',
};
