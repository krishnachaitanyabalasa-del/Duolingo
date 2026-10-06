import { apiFetch } from './client';
import { Course, SkillStatus } from '@/types/course';
import { MOCK_COURSE } from '../mockData';

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
      flag: data.icon || '🇪🇸',
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

          const totalLessons = s.lessons?.length || 4;
          const completedLessons = s.lessons?.filter((l) => l.is_completed).length || (s.status === 'COMPLETED' ? totalLessons : 0);

          const offsets = [0, 52, 75, 48, 0, -48, -75, -52];
          const positionOffset = offsets[sIdx % offsets.length];

          return {
            id: s.id.toString(),
            title: s.title,
            description: s.description || `Learn ${s.title} in Spanish`,
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
