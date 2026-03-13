export interface SkillNode {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  cluster: 'root' | 'frontend' | 'backend' | 'data-infrastructure' | 'ai-automation';
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

export interface ClusterPosition {
  offsetX: number;
  offsetY: number;
}

export const NEURAL_SKILLS_DATA: SkillNode[] = [
  // Root Node
  { id: 'root-engineering', name: 'Development Skills', proficiency: 100, category: 'Root', cluster: 'root', x: 0, y: 0 },

  // Frontend Cluster
  { id: 'angular', name: 'Angular', proficiency: 95, category: 'Frontend', cluster: 'frontend' },
  { id: 'react', name: 'React', proficiency: 85, category: 'Frontend', cluster: 'frontend' },
  { id: 'typescript', name: 'TypeScript', proficiency: 92, category: 'Frontend', cluster: 'frontend' },
  { id: 'css-scss', name: 'Modern CSS', proficiency: 90, category: 'Frontend', cluster: 'frontend' },

  // Backend Cluster
  { id: 'nodejs', name: 'Node.js', proficiency: 90, category: 'Backend', cluster: 'backend' },
  { id: 'express', name: 'Express', proficiency: 88, category: 'Backend', cluster: 'backend' },
  { id: 'restapis', name: 'REST APIs', proficiency: 92, category: 'Backend', cluster: 'backend' },
  { id: 'auth-systems', name: 'Authentication', proficiency: 88, category: 'Backend', cluster: 'backend' },

  // Data & Infrastructure Cluster
  { id: 'postgresql', name: 'PostgreSQL', proficiency: 88, category: 'Data', cluster: 'data-infrastructure' },
  { id: 'mongodb', name: 'MongoDB', proficiency: 82, category: 'Infrastructure', cluster: 'data-infrastructure' },
  { id: 'cicd', name: 'CI/CD', proficiency: 90, category: 'Infrastructure', cluster: 'data-infrastructure' },

  // AI/Automation Cluster
  { id: 'ai-integration', name: 'AI Integrations', proficiency: 85, category: 'Tools', cluster: 'ai-automation' },
  { id: 'automation', name: 'Automation Systems', proficiency: 80, category: 'Tools', cluster: 'ai-automation' },
  { id: 'api-intelligence', name: 'API Intelligence', proficiency: 88, category: 'Tools', cluster: 'ai-automation' },
  { id: 'data-processing', name: 'Data Processing', proficiency: 85, category: 'Tools', cluster: 'ai-automation' },
];

export const SKILL_CONNECTIONS: Connection[] = [
  // Root to branches
  { source: 'root-engineering', target: 'angular', strength: 0.9 },
  { source: 'root-engineering', target: 'nodejs', strength: 0.9 },
  { source: 'root-engineering', target: 'postgresql', strength: 0.9 },
  { source: 'root-engineering', target: 'ai-integration', strength: 0.9 },

  // Frontend interconnections
  { source: 'angular', target: 'typescript', strength: 0.95 },
  { source: 'react', target: 'typescript', strength: 0.9 },
  { source: 'angular', target: 'css-scss', strength: 0.8 },
  { source: 'react', target: 'css-scss', strength: 0.8 },
  { source: 'angular', target: 'react', strength: 0.7 },

  // Backend interconnections
  { source: 'nodejs', target: 'express', strength: 0.95 },
  { source: 'express', target: 'restapis', strength: 0.9 },
  { source: 'nodejs', target: 'auth-systems', strength: 0.85 },
  { source: 'express', target: 'auth-systems', strength: 0.8 },

  // Data interconnections
  { source: 'postgresql', target: 'docker', strength: 0.8 },
  { source: 'mongodb', target: 'docker', strength: 0.8 },
  { source: 'cicd', target: 'docker', strength: 0.85 },
  { source: 'postgresql', target: 'mongodb', strength: 0.7 },

  // AI/Automation interconnections
  { source: 'ai-integration', target: 'automation', strength: 0.85 },
  { source: 'automation', target: 'api-intelligence', strength: 0.8 },
  { source: 'automation', target: 'data-processing', strength: 0.85 },
  { source: 'api-intelligence', target: 'data-processing', strength: 0.8 },

  // Cross-cluster connections
  { source: 'typescript', target: 'nodejs', strength: 0.9 },
  { source: 'restapis', target: 'postgresql', strength: 0.85 },
  { source: 'express', target: 'postgresql', strength: 0.85 },
  { source: 'system-design', target: 'nodejs', strength: 0.8 },
  { source: 'ai-integration', target: 'nodejs', strength: 0.85 },
  { source: 'automation', target: 'cicd', strength: 0.9 },
];

export const CLUSTER_POSITIONS = {
  'root': { offsetX: 0, offsetY: 0 },
  'frontend': { offsetX: -300, offsetY: -220 },
  'backend': { offsetX: 300, offsetY: -220 },
  'data-infrastructure': { offsetX: -300, offsetY: 220 },
  'ai-automation': { offsetX: 300, offsetY: 220 },
};

export const CLUSTER_COLORS = {
  'root': '#00d4ff',
  'frontend': '#00bfff',
  'backend': '#9b4d96',
  'data-infrastructure': '#00bfff',
  'ai-automation': '#9b4d96',
};
