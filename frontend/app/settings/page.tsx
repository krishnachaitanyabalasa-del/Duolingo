'use client';

import React, { useState } from 'react';
import { Volume2, Moon, Globe, Target, Bell, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyGoal, setDailyGoal] = useState('50');

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      <h1 className="text-3xl font-black text-gray-800 mb-6">Settings</h1>

      {/* Preferences Card */}
      <div className="duo-card space-y-6">
        <h3 className="text-lg font-extrabold text-gray-800">Preferences</h3>

        {/* Sound Effects */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-800 block">Sound Effects</span>
              <span className="text-xs font-medium text-gray-400">Play cheerful audio feedback during lessons</span>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              soundEnabled ? 'bg-green-500' : 'bg-gray-300'
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
            <Moon className="w-5 h-5 text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-800 block">Dark Mode</span>
              <span className="text-xs font-medium text-gray-400">Switch application theme</span>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              darkMode ? 'bg-green-500' : 'bg-gray-300'
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
            <Target className="w-5 h-5 text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-800 block">Daily Goal</span>
              <span className="text-xs font-medium text-gray-400">Target XP to earn each day</span>
            </div>
          </div>
          <select
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
            className="p-2 rounded-xl border-2 border-gray-200 font-extrabold text-sm text-gray-700 bg-white"
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
            <Globe className="w-5 h-5 text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-800 block">Active Course</span>
              <span className="text-xs font-medium text-gray-400">Current language being learned</span>
            </div>
          </div>
          <span className="font-extrabold text-sm text-gray-700">🇪🇸 Spanish</span>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <div>
              <span className="font-extrabold text-sm text-gray-800 block">Practice Reminders</span>
              <span className="text-xs font-medium text-gray-400">Receive daily streak notifications</span>
            </div>
          </div>
          <span className="font-extrabold text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            ENABLED
          </span>
        </div>
      </div>

      {/* Super Duolingo Subscription Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl flex items-center justify-between">
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
