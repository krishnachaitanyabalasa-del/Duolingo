'use client';

import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types/course';
import { getCourse } from '@/lib/api/course';
import { MOCK_COURSE } from '@/lib/mockData';

export function useCourse() {
  const [course, setCourse] = useState<Course>(MOCK_COURSE);
  const [loading, setLoading] = useState(true);

  const fetchCourseData = useCallback(async () => {
    setLoading(true);
    const data = await getCourse();
    if (data) setCourse(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  return {
    course,
    loading,
    refreshCourse: fetchCourseData,
  };
}
