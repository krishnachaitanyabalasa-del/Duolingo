'use client';

import React, { useState } from 'react';
import { CoursePathUnit, CoursePathSkill, UnitTestInfo } from '@/lib/api/course';
import { UnitHeader } from './UnitHeader';
import { SkillNode } from './SkillNode';
import { RewardNode } from './RewardNode';
import { LessonModal } from './LessonModal';
import { TestPlayerModal } from './TestPlayerModal';
import { Trophy, Lock, CheckCircle2, Play, RefreshCw, Sparkles } from 'lucide-react';
import { SkillNode as SkillNodeType } from '@/types/course';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface SkillPathProps {
  units: CoursePathUnit[];
  onRefresh: () => void;
}

const UNIT_COLORS = [
  'bg-[#58cc02] border-[#46a302]', // Unit 1 - Green
  'bg-[#ff9600] border-[#e07300]', // Unit 2 - Orange
  'bg-[#1cb0f6] border-[#1899d6]', // Unit 3 - Blue
  'bg-[#ff4b4b] border-[#ea2b2b]', // Unit 4 - Red
  'bg-[#ce82ff border-[#b158f7]', // Unit 5 - Purple
  'bg-[#00cd9c] border-[#00a880]', // Unit 6 - Teal
  'bg-[#ffb020] border-[#d48c00]', // Unit 7 - Amber
  'bg-[#ff7c93] border-[#e0546c]', // Unit 8 - Pink
  'bg-[#84d800] border-[#68ab00]', // Unit 9 - Lime
  'bg-[#1cb0f6] border-[#1899d6]', // Unit 10 - Cyan
];

export const SkillPath: React.FC<SkillPathProps> = ({ units, onRefresh }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeType | null>(null);
  const [activeTest, setActiveTest] = useState<{ id: number; name: string } | null>(null);

  const handleTestSuccess = () => {
    onRefresh();
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 max-w-xl mx-auto min-h-screen">
      {units.map((unit, uIdx) => {
        const unitColor = UNIT_COLORS[uIdx % UNIT_COLORS.length];
        const isUnitLocked = unit.status === 'LOCKED';

        return (
          <div key={unit.id} className="w-full flex flex-col items-center mb-16">
            {/* Unit Banner Header */}
            <div className={clsx(
              "w-full rounded-3xl p-5 text-white shadow-lg mb-8 flex items-center justify-between border-b-4 transition-all",
              isUnitLocked ? "bg-gray-400 border-gray-500 opacity-80" : unitColor
            )}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/90 text-xs font-black uppercase tracking-wider">
                  <span>UNIT {uIdx + 1}</span>
                  <span className="opacity-75">•</span>
                  <span className="px-2 py-0.5 bg-black/20 rounded-md text-[10px]">
                    {unit.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{unit.name}</h2>
                {unit.description && (
                  <p className="text-xs font-extrabold text-white/90">{unit.description}</p>
                )}
              </div>

              {unit.progress_percent > 0 && (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-black">{Math.round(unit.progress_percent)}%</span>
                  <div className="w-16 bg-black/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all"
                      style={{ width: `${unit.progress_percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Snake Path of Skills */}
            <div className="relative flex flex-col items-center py-4 w-full">
              {unit.skills.map((skill, sIdx) => {
                const offsets = [0, 35, 15, -25, -45, -20, 25, 40];
                const positionOffset = offsets[sIdx % offsets.length];

                let convertedStatus: 'LOCKED' | 'AVAILABLE' | 'CURRENT' | 'COMPLETED' = 'LOCKED';
                if (skill.status === 'COMPLETED') convertedStatus = 'COMPLETED';
                else if (skill.status === 'IN_PROGRESS' || skill.status === 'AVAILABLE') {
                  convertedStatus = sIdx === 0 || skill.status === 'IN_PROGRESS' ? 'CURRENT' : 'AVAILABLE';
                }

                const totalLessons = skill.lessons?.length || 2;
                const completedLessons = skill.lessons?.filter((l) => l.is_completed).length || (skill.status === 'COMPLETED' ? totalLessons : 0);

                const skillForModal: SkillNodeType = {
                  id: skill.id.toString(),
                  title: skill.name,
                  description: `Master ${skill.name}`,
                  icon: sIdx === 0 ? 'MessageSquare' : sIdx === 1 ? 'UserCheck' : 'Utensils',
                  status: convertedStatus,
                  totalLessons,
                  completedLessons,
                  crowns: skill.status === 'COMPLETED' ? 3 : 0,
                  maxCrowns: 3,
                  positionOffset,
                };

                return (
                  <React.Fragment key={skill.id}>
                    <SkillNode
                      skill={skillForModal}
                      onClick={() => setSelectedSkill(skillForModal)}
                    />
                    {sIdx === 1 && <RewardNode positionOffset={-20} />}
                  </React.Fragment>
                );
              })}

              {/* UNIT TEST NODE at end of unit */}
              {unit.test && (
                <div className="relative flex flex-col items-center mt-8 group">
                  <div className="flex flex-col items-center">
                    <motion.button
                      whileHover={!unit.test.locked ? { scale: 1.08 } : {}}
                      whileTap={!unit.test.locked ? { scale: 0.95 } : {}}
                      onClick={() => {
                        if (unit.test && !unit.test.locked) {
                          setActiveTest({ id: unit.test.id, name: unit.test.name });
                        }
                      }}
                      disabled={unit.test.locked}
                      className={clsx(
                        'w-24 h-24 rounded-3xl flex items-center justify-center transition-all shadow-xl cursor-pointer border-b-4',
                        unit.test.status === 'PASSED' && 'bg-yellow-400 border-yellow-600 text-yellow-950',
                        (unit.test.status === 'AVAILABLE' || unit.test.status === 'FAILED') &&
                          'bg-yellow-500 border-yellow-700 text-white ring-4 ring-yellow-400/50 animate-pulse',
                        unit.test.locked &&
                          'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      )}
                    >
                      {unit.test.locked ? (
                        <Lock className="w-10 h-10" />
                      ) : unit.test.status === 'PASSED' ? (
                        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                      ) : unit.test.status === 'FAILED' ? (
                        <RefreshCw className="w-10 h-10" />
                      ) : (
                        <Trophy className="w-12 h-12" />
                      )}
                    </motion.button>

                    <div className="mt-3 flex flex-col items-center text-center">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        {unit.test.name}
                      </span>
                      {unit.test.locked ? (
                        <span className="text-[11px] font-bold text-gray-400">
                          Complete lessons to unlock test
                        </span>
                      ) : unit.test.status === 'PASSED' ? (
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

      {/* Lesson Modal */}
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
