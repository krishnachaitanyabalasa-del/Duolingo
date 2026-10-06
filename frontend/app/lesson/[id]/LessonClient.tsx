'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { LessonPlayer } from '@/components/lesson/LessonPlayer';

export default function LessonClient() {
  const params = useParams();
  const lessonId = typeof params?.id === 'string' ? params.id : '1';

  return <LessonPlayer lessonId={lessonId} />;
}
