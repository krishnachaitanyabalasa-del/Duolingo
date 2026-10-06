'use client';

import React, { useState } from 'react';
import { Unit } from '@/types/course';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { GuidebookModal } from './GuidebookModal';

import { getUnitTheme } from '@/lib/unitTheme';

interface UnitHeaderProps {
  unit: Unit;
}

export const UnitHeader: React.FC<UnitHeaderProps> = ({ unit }) => {
  const [showGuidebook, setShowGuidebook] = useState(false);
  const theme = getUnitTheme(unit.number);

  return (
    <>
      <div className={`w-full max-w-xl mx-auto rounded-3xl p-5 text-white ${theme.headerBg} border-b-4 ${theme.headerBorder} shadow-lg mb-8 flex items-center justify-between`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/90 text-xs font-black uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
            <span>SECTION {unit.id}, UNIT {unit.number}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{unit.title}</h2>
          <p className="text-xs font-extrabold text-white/90">{unit.description}</p>
        </div>

        <button
          onClick={() => setShowGuidebook(true)}
          className="duo-button bg-white/20 hover:bg-white/30 border-white/30 text-white text-xs py-2.5 px-3.5 flex items-center gap-2 rounded-2xl shrink-0 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">GUIDEBOOK</span>
        </button>
      </div>

      <GuidebookModal
        unit={showGuidebook ? unit : null}
        onClose={() => setShowGuidebook(false)}
      />
    </>
  );
};
