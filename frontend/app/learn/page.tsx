'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCoursePath, CoursePathResponse } from '@/lib/api/course';
import { SkillPath } from '@/components/learn/SkillPath';
import { Loader2, RefreshCw } from 'lucide-react';

export default function LearnPage() {
  const [coursePath, setCoursePath] = useState<CoursePathResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPath = useCallback(async () => {
    setLoading(true);
    const data = await getCoursePath();
    if (data) {
      setCoursePath(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  // IntersectionObserver for progressive scroll loading of units
  useEffect(() => {
    if (!sentinelRef.current || !coursePath) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            if (coursePath && prev < coursePath.units.length) {
              return Math.min(coursePath.units.length, prev + 2);
            }
            return prev;
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [coursePath]);

  if (loading && !coursePath) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        <p className="font-extrabold text-gray-500 dark:text-gray-400">Loading learning path...</p>
      </div>
    );
  }

  if (!coursePath || coursePath.units.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="font-extrabold text-gray-700 dark:text-gray-300 text-lg">
          Could not connect to FastAPI learning progression.
        </p>
        <button
          onClick={fetchPath}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-extrabold py-3 px-6 rounded-2xl shadow-[0_4px_0_#15803d]"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const visibleUnits = coursePath.units.slice(0, visibleCount);

  return (
    <div className="w-full pb-20">
      <div className="text-center py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-4 sticky top-0 z-30 shadow-xs">
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-white uppercase tracking-wider">
          {coursePath.course.name}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
          Showing {visibleUnits.length} of {coursePath.units.length} Units (Scroll to load more)
        </p>
      </div>

      <SkillPath units={visibleUnits} onRefresh={fetchPath} />

      {/* Sentinel trigger for infinite scroll loading of remaining units */}
      {visibleCount < coursePath.units.length && (
        <div ref={sentinelRef} className="py-8 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
