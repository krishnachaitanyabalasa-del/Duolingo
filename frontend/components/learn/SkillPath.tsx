'use client';

import React, { useState } from 'react';
import { Course, SkillNode as SkillNodeType } from '@/types/course';
import { UnitHeader } from './UnitHeader';
import { SkillNode } from './SkillNode';
import { RewardNode } from './RewardNode';
import { LessonModal } from './LessonModal';

interface SkillPathProps {
  course: Course;
}

export const SkillPath: React.FC<SkillPathProps> = ({ course }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeType | null>(null);

  return (
    <div className="flex flex-col items-center py-6 px-4 max-w-xl mx-auto min-h-screen">
      {course.units.map((unit) => (
        <div key={unit.id} className="w-full flex flex-col items-center mb-12">
          {/* Unit Header Banner (Matching Screenshot 3) */}
          <UnitHeader unit={unit} />

          {/* Vertical Snake Path of Skills */}
          <div className="relative flex flex-col items-center py-4 w-full">
            {unit.skills.map((skill, idx) => {
              const nextSkillOffset = unit.skills[idx + 1]?.positionOffset ?? skill.positionOffset;
              const rewardOffset = Math.round((skill.positionOffset + nextSkillOffset) / 2);

              return (
                <React.Fragment key={skill.id}>
                  <SkillNode
                    skill={skill}
                    unitNumber={unit.number}
                    onClick={() => setSelectedSkill(skill)}
                  />
                  {/* Insert a Reward Treasure Chest Node after 3rd skill */}
                  {idx === 2 && <RewardNode positionOffset={rewardOffset} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}

      {/* Lesson Details Modal Dialog */}
      <LessonModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
  );
};
