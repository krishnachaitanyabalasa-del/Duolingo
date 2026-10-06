'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Course, Unit, SkillNode as SkillNodeType } from '@/types/course';
import { UnitHeader } from './UnitHeader';
import { SkillNode } from './SkillNode';
import { RewardNode } from './RewardNode';
import { LessonModal } from './LessonModal';
import { generateNextUnit } from '@/lib/infiniteUnits';
import { Loader2 } from 'lucide-react';

interface SkillPathProps {
  course: Course;
}

export const SkillPath: React.FC<SkillPathProps> = ({ course }) => {
  const [units, setUnits] = useState<Unit[]>(course.units);
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeType | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Sync state if course updates from parent
  useEffect(() => {
    if (course?.units && course.units.length > 0) {
      setUnits((prev) => {
        if (prev.length <= course.units.length) return course.units;
        return prev;
      });
    }
  }, [course]);

  // Load more units dynamically
  const loadMoreUnits = useCallback(() => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);

    setTimeout(() => {
      setUnits((prevUnits) => {
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

  return (
    <div className="flex flex-col items-center py-6 px-4 max-w-xl mx-auto min-h-screen">
      {units.map((unit) => {
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
    </div>
  );
};


