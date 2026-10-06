'use client';

import React, { useState } from 'react';
import { Volume2, Moon, Sun, Globe, Target, Bell, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyGoal, setDailyGoal] = useState('50');
  const { isDark, resolvedTheme } = useTheme();

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Settings</h1>

      {/* Preferences Card */}
      <div className="duo-card space-y-6">
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Preferences</h3>

        {/* Sound Effects */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white block">Sound Effects</span>
              <span className="text-xs font-medium text-gray-500 dark:text-[#93a7b1]">Play cheerful audio feedback during lessons</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              soundEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme / Appearance (White Mode & Dark Mode) */}
        <div className="pt-2 border-t border-gray-100 dark:border-[#20323d] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-amber-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <span className="font-extrabold text-sm text-gray-900 dark:text-white block">Appearance Theme</span>
                <span className="text-xs font-medium text-gray-500 dark:text-[#93a7b1]">
                  Current: <strong className="text-gray-800 dark:text-white uppercase">{resolvedTheme === 'light' ? 'White (Light) Mode' : 'Dark Mode'}</strong>
                </span>
              </div>
            </div>
            <ThemeToggle variant="switch" />
          </div>
          <div className="pt-1">
            <ThemeToggle variant="segmented" />
          </div>
        </div>

        {/* Daily Goal */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#20323d]">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white block">Daily Goal</span>
              <span className="text-xs font-medium text-gray-500 dark:text-[#93a7b1]">Target XP to earn each day</span>
            </div>
          </div>
          <select
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
            className="p-2 rounded-xl border-2 border-gray-200 dark:border-[#20323d] font-extrabold text-sm text-gray-800 dark:text-white bg-white dark:bg-[#131f24] focus:outline-none focus:border-[#1cb0f6]"
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
            <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white block">Active Course</span>
              <span className="text-xs font-medium text-gray-500 dark:text-[#93a7b1]">Current language being learned</span>
            </div>
          </div>
          <span className="font-extrabold text-sm text-gray-800 dark:text-gray-200">🇪🇸 Spanish</span>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white block">Practice Reminders</span>
              <span className="text-xs font-medium text-gray-500 dark:text-[#93a7b1]">Receive daily streak notifications</span>
            </div>
          </div>
          <span className="font-extrabold text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800/60">
            ENABLED
          </span>
        </div>
      </div>

      {/* Super Duolingo Subscription Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="font-black text-lg">Super Duolingo</span>
          </div>
          <p className="text-xs text-indigo-100 max-w-xs">
            Unlock unlimited hearts, personalized mistake practice, and ad-free learning.
          </p>
        </div>
        <button className="duo-button duo-button-amber text-xs py-2.5 px-4 font-black">
          MANAGE
        </button>
      </div>
    </div>
  );
}
