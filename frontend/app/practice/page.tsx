'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, Heart, Headphones, Target, Sparkles, ArrowRight } from 'lucide-react';

export default function PracticePage() {
  const practiceModules = [
    {
      title: 'Mistakes Review',
      description: 'Review questions you missed in previous lessons to strengthen weak areas.',
      icon: Target,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      btnColor: 'duo-button-rose',
      reward: '+1 Heart & 15 XP',
      lessonId: 'sk_food',
    },
    {
      title: 'Listening & Pronunciation',
      description: 'Practice text-to-speech listening comprehension and speaking exercises.',
      icon: Headphones,
      color: 'bg-[#1cb0f6]/20 text-[#1cb0f6] border-[#1cb0f6]/40',
      btnColor: 'duo-button-blue',
      reward: '15 XP',
      lessonId: 'sk_greetings',
    },
    {
      title: 'Unit 1 Mastery Review',
      description: 'Complete a rapid review of greetings, introductions, and essential words.',
      icon: Dumbbell,
      color: 'bg-[#ff9600]/20 text-[#ff9600] border-[#ff9600]/40',
      btnColor: 'duo-button-amber',
      reward: '20 XP',
      lessonId: 'sk_introductions',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="duo-card-dark p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ff9600] text-xs font-black uppercase mb-1">
            <Dumbbell className="w-4 h-4" /> Practice Hub
          </div>
          <h1 className="text-3xl font-black text-white">Targeted Practice</h1>
          <p className="text-xs font-bold text-[#93a7b1] mt-1">
            Earn back lost hearts and boost your XP by practicing key skills.
          </p>
        </div>

        <div className="p-4 bg-rose-500/10 border-2 border-rose-500 rounded-2xl shrink-0 text-center flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-xs font-black text-white">Earn Hearts</span>
        </div>
      </div>

      {/* Practice Cards */}
      <div className="space-y-4">
        {practiceModules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <div
              key={idx}
              className="duo-card-dark p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[#1cb0f6] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl border-2 shrink-0 ${mod.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-extrabold text-white">{mod.title}</h3>
                    <span className="px-2.5 py-0.5 bg-[#131f24] border border-[#20323d] text-[10px] font-black text-[#58cc02] rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {mod.reward}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#93a7b1] max-w-md">{mod.description}</p>
                </div>
              </div>

              <Link
                href={`/lesson/${mod.lessonId}`}
                className={`duo-button ${mod.btnColor} text-xs py-3 px-6 shrink-0 w-full sm:w-auto flex items-center justify-center gap-2`}
              >
                START <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
