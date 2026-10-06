export type SkillStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED' | 'CURRENT';

export interface LessonNode {
  id: number;
  title: string;
  order: number;
  xpReward?: number;
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  isCompleted: boolean;
}

export interface SkillNode {
  id: string;
  title: string;
  description?: string;
  icon: string; // lucide icon name or emoji
  status: SkillStatus;
  totalLessons: number;
  completedLessons: number;
  crowns: number;
  maxCrowns: number;
  positionOffset: number; // -40 to 40 for curved path offset
  lessons?: LessonNode[];
  activeLessonId?: number;
}

export interface Unit {
  id: number;
  number: number;
  title: string;
  description: string;
  color: string; // Tailwind bg color class or hex (e.g. 'bg-green-500', 'bg-sky-500', 'bg-purple-500')
  skills: SkillNode[];
}

export interface Course {
  id: number;
  name: string;
  code: string;
  flag: string;
  units: Unit[];
}
