'use client';

import React from 'react';
import { Unit } from '@/types/course';
import { SpeakButton } from '../audio/SpeakButton';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidebookModalProps {
  unit: Unit | null;
  onClose: () => void;
}

const KEY_PHRASES = [
  { spanish: '¡Hola! ¿Cómo estás?', english: 'Hello! How are you?' },
  { spanish: 'Me llamo Alex.', english: 'My name is Alex.' },
  { spanish: 'Un café con leche, por favor.', english: 'A coffee with milk, please.' },
  { spanish: 'Mucho gusto en conocerte.', english: 'Nice to meet you.' },
];

export const GuidebookModal: React.FC<GuidebookModalProps> = ({ unit, onClose }) => {
  if (!unit) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-[#20323d] pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-amber-50 dark:bg-[#ff9600]/20 rounded-xl border border-amber-200 dark:border-[#ff9600]/40">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-[#ff9600]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 dark:text-[#52656d]">UNIT {unit.number} GUIDEBOOK</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{unit.title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-[#52656d] hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[#20323d] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Key Phrases Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-[#ff9600]" /> Key Phrases & Pronunciation
            </h4>
            <div className="space-y-2.5">
              {KEY_PHRASES.map((phrase, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 dark:bg-[#131f24] border border-gray-200 dark:border-[#20323d] rounded-2xl flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-extrabold text-base text-gray-900 dark:text-white block">{phrase.spanish}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] block">{phrase.english}</span>
                  </div>
                  <SpeakButton text={phrase.spanish} className="shrink-0 p-2.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Overview Section */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#ff9600]/10 border-2 border-amber-200 dark:border-[#ff9600]/30 space-y-2">
            <h5 className="font-black text-sm text-amber-600 dark:text-[#ff9600]">Grammar Tip: Polite Greetings</h5>
            <p className="text-xs font-bold text-gray-700 dark:text-[#dce6eb] leading-relaxed">
              In Spanish, greetings change depending on the time of day:
              <br />
              • <strong>Buenos días</strong> = Good morning (until noon)
              <br />
              • <strong>Buenas tardes</strong> = Good afternoon (after noon)
              <br />
              • <strong>Buenas noches</strong> = Good evening / night
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full duo-button duo-button-amber text-xs py-3.5"
          >
            GOT IT!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
