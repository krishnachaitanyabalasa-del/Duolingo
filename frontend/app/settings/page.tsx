'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Moon, Globe, Target, Bell, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dailyGoal, setDailyGoal] = useState('50');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('duo_sound_enabled');
      if (savedSound !== null) setSoundEnabled(savedSound !== 'false');

      const savedGoal = localStorage.getItem('duo_daily_goal');
      if (savedGoal) setDailyGoal(savedGoal);
    }
  }, []);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('duo_sound_enabled', String(nextVal));
    }
  };

  const handleGoalChange = (val: string) => {
    setDailyGoal(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('duo_daily_goal', val);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      <h1 className="text-3xl font-black text-white mb-6">Settings</h1>

      {/* Preferences Card */}
      <div className="duo-card-dark space-y-6">
        <h3 className="text-lg font-extrabold text-white">Preferences</h3>

        {/* Sound Effects */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[#93a7b1]" />
            <div>
              <span className="font-extrabold text-sm text-white block">Sound Effects</span>
              <span className="text-xs font-bold text-[#52656d]">Play audio chimes during exercises</span>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              soundEnabled ? 'bg-[#58cc02]' : 'bg-[#20323d]'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-[#93a7b1]" />
            <div>
              <span className="font-extrabold text-sm text-white block">Dark Mode</span>
              <span className="text-xs font-bold text-[#52656d]">Duolingo Dark Theme active</span>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              darkMode ? 'bg-[#58cc02]' : 'bg-[#20323d]'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Daily Goal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-[#93a7b1]" />
            <div>
              <span className="font-extrabold text-sm text-white block">Daily Goal</span>
              <span className="text-xs font-bold text-[#52656d]">Target XP to earn each day</span>
            </div>
          </div>
          <select
            value={dailyGoal}
            onChange={(e) => handleGoalChange(e.target.value)}
            className="p-2.5 rounded-xl border-2 border-[#20323d] font-extrabold text-xs text-white bg-[#131f24] focus:outline-none"
          >
            <option value="10">Casual (10 XP)</option>
            <option value="30">Regular (30 XP)</option>
            <option value="50">Serious (50 XP)</option>
            <option value="100">Intense (100 XP)</option>
          </select>
        </div>

        {/* Learning Language */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#93a7b1]" />
            <div>
              <span className="font-extrabold text-sm text-white block">Active Course</span>
              <span className="text-xs font-bold text-[#52656d]">Current language course</span>
            </div>
          </div>
          <span className="font-extrabold text-sm text-white">🇪🇸 Spanish</span>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#93a7b1]" />
            <div>
              <span className="font-extrabold text-sm text-white block">Streak Notifications</span>
              <span className="text-xs font-bold text-[#52656d]">Receive daily streak reminders</span>
            </div>
          </div>
          <span className="font-extrabold text-xs text-[#58cc02] bg-[#58cc02]/10 px-2.5 py-1 rounded-full border border-[#58cc02]">
            ENABLED
          </span>
        </div>
      </div>

      {/* Super Duolingo Promotion Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 border-2 border-indigo-500/40 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="font-black text-lg">Super Duolingo</span>
          </div>
          <p className="text-xs font-bold text-indigo-200 max-w-xs">
            Unlock unlimited hearts, mistake practice, and ad-free learning.
          </p>
        </div>
        <button className="duo-button duo-button-amber text-xs py-2.5 px-4 font-black">
          MANAGE
        </button>
      </div>
    </div>
  );
}
