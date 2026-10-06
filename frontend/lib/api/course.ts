import { apiFetch } from './client';
import { Course, SkillStatus } from '@/types/course';
import { MOCK_COURSE } from '../mockData';

export interface LessonSummary {
  id: number;
  skill_id: number;
  title: string;
  order: number;
  xp_reward: number;
  is_completed: boolean;
  completed?: boolean;
  status?: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface CoursePathSkill {
  id: number;
  name: string;
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  progress_percent: number;
  lessons: LessonSummary[];
}

export interface UnitTestInfo {
  id: number;
  name: string;
  status: 'LOCKED' | 'AVAILABLE' | 'PASSED' | 'FAILED';
  locked: boolean;
}

export interface CoursePathUnit {
  id: number;
  name: string;
  description?: string;
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  progress_percent: number;
  skills: CoursePathSkill[];
  lessons?: LessonSummary[];
  test?: UnitTestInfo;
}

export interface CoursePathResponse {
  course: {
    id: number;
    name: string;
  };
  units: CoursePathUnit[];
}

export interface TestQuestion {
  id: number;
  type: string; // MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER
  question: string;
  options?: string[];
  word_bank?: string[];
  pairs?: { left: string; right: string }[];
  sentence_prefix?: string;
  sentence_suffix?: string;
}

export interface UnitTestDetail {
  id: number;
  unit_id: number;
  name: string;
  questions: TestQuestion[];
}

export interface TestAnswerSubmission {
  question_id: number;
  answer: any;
}

export interface TestSubmitResponse {
  test_id: number;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  xp_earned: number;
  next_unit_unlocked?: number;
}

interface RawBackendCourse {
  id: number;
  title: string;
  description: string;
  language_code: string;
  icon: string;
  units: {
    id: number;
    course_id: number;
    title: string;
    order: number;
    skills: {
      id: number;
      title: string;
      status: string;
      crown_level?: number;
      progress_percentage?: number;
      icon?: string;
      description?: string;
      lessons?: { id: number; title: string; is_completed?: boolean }[];
    }[];
  }[];
}

export async function getCourse(): Promise<Course> {
  const data = await apiFetch<RawBackendCourse>('/api/course');
  if (!data) return MOCK_COURSE;

  try {
    return {
      id: data.id,
      name: data.title,
      code: data.language_code || 'es',
      flag: data.icon || '🇺🇸',
      units: data.units.map((u, uIdx) => ({
        id: u.id,
        number: u.order || uIdx + 1,
        title: u.title,
        description: u.title,
        color: uIdx % 2 === 0 ? 'bg-[#ff9600]' : 'bg-[#1cb0f6]',
        skills: u.skills.map((s, sIdx) => {
          let status: SkillStatus = 'LOCKED';
          if (s.status === 'COMPLETED') status = 'COMPLETED';
          else if (s.status === 'IN_PROGRESS' || s.status === 'AVAILABLE') {
            status = sIdx === 0 || s.status === 'IN_PROGRESS' ? 'CURRENT' : 'AVAILABLE';
          }

          const totalLessons = s.lessons?.length || 2;
          const completedLessons = s.lessons?.filter((l) => l.is_completed).length || (s.status === 'COMPLETED' ? totalLessons : 0);

          const offsets = [0, 85, -85, 90, -90, 85, -85, 90];
          const positionOffset = offsets[sIdx % offsets.length];

          return {
            id: s.id.toString(),
            title: s.title,
            description: s.description || `Learn ${s.title}`,
            icon: s.icon || (sIdx === 0 ? 'MessageSquare' : sIdx === 1 ? 'UserCheck' : 'Utensils'),
            status,
            totalLessons,
            completedLessons,
            crowns: s.crown_level || (s.status === 'COMPLETED' ? 3 : 0),
            maxCrowns: 3,
            positionOffset,
          };
        }),
      })),
    };
  } catch (err) {
    console.warn('Error parsing backend course data:', err);
    return MOCK_COURSE;
  }
}

export async function getCoursePath(): Promise<CoursePathResponse> {
  const data = await apiFetch<CoursePathResponse>('/api/course/path');
  if (data) return data;

  // Fallback to rich mock course path
  const mockCourse = await getCourse();
  return {
    course: {
      id: mockCourse.id,
      name: mockCourse.name,
    },
    units: mockCourse.units.map((u, uIdx) => ({
      id: u.id,
      name: u.title,
      description: u.description,
      status: uIdx === 0 ? 'IN_PROGRESS' : 'LOCKED',
      progress_percent: uIdx === 0 ? 40 : 0,
      skills: u.skills.map((s, sIdx) => ({
        id: sIdx + 1 + uIdx * 10,
        name: s.title,
        status: s.status === 'COMPLETED' ? 'COMPLETED' : s.status === 'CURRENT' ? 'IN_PROGRESS' : 'LOCKED',
        progress_percent: s.completedLessons * 25,
        lessons: Array.from({ length: s.totalLessons }).map((_, lIdx) => ({
          id: lIdx + 1,
          skill_id: sIdx + 1,
          title: `Lesson ${lIdx + 1}`,
          order: lIdx + 1,
          xp_reward: 10,
          is_completed: lIdx < s.completedLessons,
        })),
      })),
      test: {
        id: u.id,
        name: `Unit ${u.number} Mastery Test`,
        status: uIdx === 0 ? 'AVAILABLE' : 'LOCKED',
        locked: uIdx !== 0,
      },
    })),
  };
}

export async function getUnitTest(testId: number): Promise<UnitTestDetail | null> {
  return await apiFetch<UnitTestDetail>(`/api/tests/${testId}`);
}

export async function submitUnitTest(
  testId: number,
  answers: TestAnswerSubmission[]
): Promise<TestSubmitResponse | null> {
  return await apiFetch<TestSubmitResponse>(`/api/tests/${testId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}
