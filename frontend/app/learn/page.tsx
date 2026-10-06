'use client';

import React from 'react';
import { useCourse } from '@/hooks/useCourse';
import { SkillPath } from '@/components/learn/SkillPath';
import { Loader2 } from 'lucide-react';

export default function LearnPage() {
  const { course, loading } = useCourse();

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        <p className="font-extrabold text-gray-500 dark:text-gray-400">Loading learning path...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SkillPath course={course} />
    </div>
  );
}
