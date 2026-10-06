'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Course, Unit, SkillNode as SkillNodeType } from '@/types/course';
import { CoursePathUnit } from '@/lib/api/course';
import { UnitHeader } from './UnitHeader';
import { SkillNode } from './SkillNode';
import { RewardNode } from './RewardNode';
import { LessonModal } from './LessonModal';
import { TestPlayerModal } from './TestPlayerModal';
import { generateNextUnit } from '@/lib/infiniteUnits';
import { Loader2, Trophy, Lock, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface SkillPathProps {
  course?: Course;
  units?: CoursePathUnit[];
  onRefresh?: () => void;
}

export const SkillPath: React.FC<SkillPathProps> = ({ course, units: apiUnits, onRefresh }) => {
  const [displayUnits, setDisplayUnits] = useState<Unit[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeType | null>(null);
  const [activeTest, setActiveTest] = useState<{ id: number; name: string } | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Sync state if course or apiUnits props change
  useEffect(() => {
    if (course?.units && course.units.length > 0) {
      setDisplayUnits((prev) => (prev.length <= course.units.length ? course.units : prev));
    } else if (apiUnits && apiUnits.length > 0) {
      // Map CoursePathUnit to Unit type
      const mappedUnits: Unit[] = apiUnits.map((u, uIdx) => ({
        id: u.id,
        number: uIdx + 1,
        title: u.name,
        description: u.description || `Unit ${uIdx + 1} Foundations`,
        color: ['bg-[#58cc02]', 'bg-[#ff9600]', 'bg-[#1cb0f6]', 'bg-[#ce82ff]', 'bg-[#ff4b4b]'][uIdx % 5],
        skills: u.skills.map((s, sIdx) => {
          let convertedStatus: 'LOCKED' | 'AVAILABLE' | 'CURRENT' | 'COMPLETED' = 'LOCKED';
          if (s.status === 'COMPLETED') convertedStatus = 'COMPLETED';
          else if (s.status === 'IN_PROGRESS' || s.status === 'AVAILABLE') {
            convertedStatus = sIdx === 0 || s.status === 'IN_PROGRESS' ? 'CURRENT' : 'AVAILABLE';
          }

          const totalLessons = s.lessons?.length || 4;
          const completedLessons =
            s.lessons?.filter((l) => l.is_completed).length || (s.status === 'COMPLETED' ? totalLessons : 0);

          const sineOffsets = [0, 45, 80, 80, 45, 0, -45, -80, -45];
          const positionOffset = sineOffsets[sIdx % sineOffsets.length];

          return {
            id: s.id.toString(),
            title: s.name,
            description: `Master ${s.name}`,
            icon: sIdx === 0 ? 'MessageSquare' : sIdx === 1 ? 'UserCheck' : 'Utensils',
            status: convertedStatus,
            totalLessons,
            completedLessons,
            crowns: s.status === 'COMPLETED' ? 3 : 0,
            maxCrowns: 3,
            positionOffset,
          };
        }),
      }));
      setDisplayUnits((prev) => (prev.length <= mappedUnits.length ? mappedUnits : prev));
    }
  }, [course, apiUnits]);

  // Load more units dynamically for infinite scrolling
  const loadMoreUnits = useCallback(() => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);

    setTimeout(() => {
      setDisplayUnits((prevUnits) => {
        const nextNum = prevUnits.length + 1;
        const newUnit1 = generateNextUnit(nextNum);
        const newUnit2 = generateNextUnit(nextNum + 1);
        return [...prevUnits, newUnit1, newUnit2];
      });
      setIsFetchingMore(false);
    }, 400);
  }, [isFetchingMore]);

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreUnits();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMoreUnits]);

  const handleTestSuccess = () => {
    if (onRefresh) onRefresh();
    setActiveTest(null);
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 max-w-xl mx-auto min-h-screen">
      {displayUnits.map((unit, uIdx) => {
        const matchingApiUnit = apiUnits?.[uIdx];

        return (
          <div key={unit.id} className="w-full flex flex-col items-center mb-16">
            {/* Unit Header Banner */}
            <UnitHeader unit={unit} />

            {/* Vertical Snake Path of Skills */}
            <div className="relative flex flex-col items-center py-4 w-full">
              {unit.skills.map((skill, idx) => {
                const nextSkillOffset = unit.skills[idx + 1]?.positionOffset ?? skill.positionOffset;
                const rewardOffset = Math.round((skill.positionOffset + nextSkillOffset) / 2);
                const isChestUnlocked = unit.skills.slice(0, 3).every((s) => s.status === 'COMPLETED');

                return (
                  <React.Fragment key={skill.id}>
                    <SkillNode
                      skill={skill}
                      unitNumber={unit.number}
                      onClick={() => setSelectedSkill(skill)}
                    />
                    {/* Insert a Reward Treasure Chest Node after 3rd skill */}
                    {idx === 2 && (
                      <RewardNode
                        positionOffset={rewardOffset}
                        isUnlocked={isChestUnlocked}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* End of Unit Test Node if API unit test exists */}
              {matchingApiUnit?.test && (
                <div className="relative flex flex-col items-center mt-8 group w-full">
                  <div className="flex flex-col items-center">
                    <motion.button
                      whileHover={!matchingApiUnit.test.locked ? { scale: 1.08 } : {}}
                      whileTap={!matchingApiUnit.test.locked ? { scale: 0.95 } : {}}
                      onClick={() => {
                        if (matchingApiUnit.test && !matchingApiUnit.test.locked) {
                          setActiveTest({ id: matchingApiUnit.test.id, name: matchingApiUnit.test.name });
                        }
                      }}
                      disabled={matchingApiUnit.test.locked}
                      className={clsx(
                        'w-24 h-24 rounded-3xl flex items-center justify-center transition-all shadow-xl cursor-pointer border-b-4',
                        matchingApiUnit.test.status === 'PASSED' &&
                          'bg-yellow-400 border-yellow-600 text-yellow-950 shadow-yellow-400/20',
                        (matchingApiUnit.test.status === 'AVAILABLE' || matchingApiUnit.test.status === 'FAILED') &&
                          'bg-yellow-500 border-yellow-700 text-white ring-4 ring-yellow-400/50 animate-pulse',
                        matchingApiUnit.test.locked &&
                          'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 opacity-75 cursor-not-allowed'
                      )}
                    >
                      {matchingApiUnit.test.locked ? (
                        <Lock className="w-10 h-10" />
                      ) : matchingApiUnit.test.status === 'PASSED' ? (
                        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                      ) : matchingApiUnit.test.status === 'FAILED' ? (
                        <RefreshCw className="w-10 h-10" />
                      ) : (
                        <Trophy className="w-12 h-12" />
                      )}
                    </motion.button>

                    <div className="mt-3 flex flex-col items-center text-center">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        {matchingApiUnit.test.name}
                      </span>
                      {matchingApiUnit.test.locked ? (
                        <span className="text-[11px] font-bold text-gray-400">
                          Complete lessons to unlock test
                        </span>
                      ) : matchingApiUnit.test.status === 'PASSED' ? (
                        <span className="text-[11px] font-extrabold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> PASSED (+50 XP)
                        </span>
                      ) : (
                        <span className="text-[11px] font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
                          Tap to Take Test
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Infinite Scroll Sentinel & Loading Indicator */}
      <div
        ref={observerTarget}
        className="w-full py-8 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 select-none"
      >
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        <span className="text-xs font-black tracking-wide uppercase">Loading new modules...</span>
      </div>

      {/* Lesson Details Modal Dialog */}
      <LessonModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      {/* Unit Test Player Modal */}
      {activeTest && (
        <TestPlayerModal
          testId={activeTest.id}
          testName={activeTest.name}
          onClose={() => setActiveTest(null)}
          onSuccess={handleTestSuccess}
        />
      )}
    </div>
  );
};
