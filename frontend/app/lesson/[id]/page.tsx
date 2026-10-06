'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { LessonPlayer } from '@/components/lesson/LessonPlayer';

export default function LessonPage() {
  const params = useParams();
  const lessonId = typeof params.id === 'string' ? params.id : 'sk_food';

  return <LessonPlayer lessonId={lessonId} />;
}
