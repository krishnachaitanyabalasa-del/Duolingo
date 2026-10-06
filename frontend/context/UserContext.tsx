'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Achievement } from '@/types/user';
import { getUserProfile, getAchievements, refillHearts as apiRefillHearts } from '@/lib/api/user';
import { MOCK_USER, MOCK_ACHIEVEMENTS } from '@/lib/mockData';
import { auth, googleProvider, onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from '@/lib/firebase';

interface UserContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  achievements: Achievement[];
  loading: boolean;
  addXp: (amount: number) => void;
  deductHeart: () => void;
  refillHearts: () => Promise<void>;
  buyItem: (item: string, cost: number) => boolean;
  updateGemsAndXp: (gems: number, xp: number) => void;
  refreshUser: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [uProfile, achs] = await Promise.all([
      getUserProfile(),
      getAchievements(),
    ]);
    if (uProfile) setUser(uProfile);
    if (achs && achs.length > 0) setAchievements(achs);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      await loadData();
    });

    return () => unsubscribe();
  }, [loadData]);

  const addXp = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + amount),
    }));
  };

  const deductHeart = () => {
    setUser((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const refillHeartsAction = async () => {
    const res = await apiRefillHearts();
    if (res.success) {
      setUser((prev) => ({
        ...prev,
        hearts: res.hearts,
        gems: res.gems,
      }));
    }
  };

  const buyItem = (item: string, cost: number): boolean => {
    if (user.gems < cost) return false;
    setUser((prev) => ({
      ...prev,
      gems: prev.gems - cost,
      hearts: item === 'refill' ? 5 : prev.hearts,
    }));
    return true;
  };

  const updateGemsAndXp = (gems: number, xp: number) => {
    setUser((prev) => ({
      ...prev,
      gems,
      xp,
    }));
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await loadData();
    } catch (err: any) {
      console.warn('Google Login popup error:', err?.message || err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    await loadData();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        firebaseUser,
        achievements,
        loading,
        addXp,
        deductHeart,
        refillHearts: refillHeartsAction,
        buyItem,
        updateGemsAndXp,
        refreshUser: loadData,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
