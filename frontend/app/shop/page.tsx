'use client';

import React, { useState } from 'react';
import { ShoppingBag, Gem, Heart, Flame, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';
import { sounds } from '@/lib/sound';

export default function ShopPage() {
  const { user, buyItem } = useUserContext();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [shopError, setShopError] = useState<string | null>(null);

  const handleBuy = (itemId: string, cost: number) => {
    setShopError(null);
    const success = buyItem(itemId, cost);
    if (success) {
      sounds.playCorrect();
      setPurchasedItems((prev) => [...prev, itemId]);
    } else {
      sounds.playIncorrect();
      setShopError('Not enough gems! Complete lessons to earn more gems.');
    }
  };

  const storeItems = [
    {
      id: 'refill',
      title: 'Full Hearts Refill',
      description: 'Refill your hearts to maximum (5 hearts) so you can keep practicing without stopping.',
      cost: 100,
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/15 border-rose-500/30',
      btnText: 'REFILL NOW',
    },
    {
      id: 'streak_freeze',
      title: 'Streak Freeze',
      description: 'Allows your streak to remain intact for one full day of inactivity.',
      cost: 200,
      icon: Flame,
      color: 'text-amber-500 bg-amber-500/15 border-amber-500/30',
      btnText: 'BUY FREEZE',
    },
    {
      id: 'double_wager',
      title: 'Double or Nothing',
      description: 'Double your 50 gem wager by maintaining a 7 day learning streak.',
      cost: 50,
      icon: Shield,
      color: 'text-sky-500 bg-sky-500/15 border-sky-500/30',
      btnText: 'ACCEPT WAGER',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="duo-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1cb0f6] text-xs font-black uppercase mb-1">
            <ShoppingBag className="w-4 h-4" /> Item Shop
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Gems Store</h1>
          <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] mt-1">
            Spend your hard-earned gems on streak freezes, heart refills, and power-ups!
          </p>
        </div>

        <div className="p-4 bg-[#1cb0f6]/10 border-2 border-[#1cb0f6] rounded-2xl shrink-0 text-center flex items-center gap-2">
          <Gem className="w-6 h-6 text-[#1cb0f6] fill-[#1cb0f6] animate-bounce" />
          <span className="text-sm font-black text-gray-900 dark:text-white">{user.gems} Gems</span>
        </div>
      </div>

      {shopError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-700/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-bold">
          {shopError}
        </div>
      )}

      {/* Super Duolingo Featured Item */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 border-2 border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-gradient-to-r from-[#1cb0f6] to-[#ce82ff] text-white text-[10px] font-black uppercase rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5" /> SUPER DUOLINGO
          </div>
          <h3 className="text-2xl font-black text-white">Unlimited Hearts & No Ads</h3>
          <p className="text-xs font-bold text-indigo-100 max-w-sm">
            Try 1 week of Super Duolingo free. Zero heart limits and unlimited Legendary practice!
          </p>
        </div>
        <button className="duo-button duo-button-amber text-xs font-black py-3 px-6 shrink-0 w-full sm:w-auto">
          START 7-DAY FREE TRIAL
        </button>
      </div>

      {/* Store Items List */}
      <div className="space-y-4">
        {storeItems.map((item) => {
          const Icon = item.icon;
          const isPurchased = purchasedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className="duo-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[#1cb0f6] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl border-2 shrink-0 ${item.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] max-w-md mb-2">{item.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-[#1cb0f6]">
                    <Gem className="w-3.5 h-3.5 fill-[#1cb0f6]" /> {item.cost} Gems
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                {isPurchased ? (
                  <span className="flex items-center justify-center gap-1 text-xs font-black text-[#58cc02] bg-[#58cc02]/10 border border-[#58cc02] px-6 py-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> OWNED
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuy(item.id, item.cost)}
                    className="w-full sm:w-auto duo-button duo-button-blue text-xs py-3 px-6 flex items-center justify-center gap-1.5"
                  >
                    {item.btnText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
