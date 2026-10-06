'use client';

import React, { useState, useEffect } from 'react';
import {
  getFullProfile,
  updateProfile,
  getAchievements,
  getFollowers,
  getFollowing,
  toggleFollow,
} from '@/lib/api/user';
import { FullProfile, Achievement, FollowerUser, UserCourse } from '@/types/user';
import { UserCard } from '@/components/profile/UserCard';
import { StatsCard } from '@/components/profile/StatsCard';
import { AchievementsGrid } from '@/components/profile/AchievementsGrid';
import { ProfileRightPanel } from '@/components/profile/ProfileRightPanel';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { FindFriendsModal } from '@/components/profile/FindFriendsModal';
import { InviteFriendsModal } from '@/components/profile/InviteFriendsModal';
import { CourseModal } from '@/components/profile/CourseModal';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [following, setFollowing] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFindFriendsOpen, setIsFindFriendsOpen] = useState(false);
  const [isInviteFriendsOpen, setIsInviteFriendsOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<UserCourse | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'following' | 'followers'>('following');

  // Success Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profData, achData, flwData, flgData] = await Promise.all([
        getFullProfile(),
        getAchievements(),
        getFollowers(),
        getFollowing(),
      ]);
      setProfile(profData);
      setAchievements(achData);
      setFollowers(flwData);
      setFollowing(flgData);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError('Unable to load profile data. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();

    const handleOpenFind = () => setIsFindFriendsOpen(true);
    const handleOpenInvite = () => setIsInviteFriendsOpen(true);

    window.addEventListener('open-find-friends', handleOpenFind);
    window.addEventListener('open-invite-friends', handleOpenInvite);

    return () => {
      window.removeEventListener('open-find-friends', handleOpenFind);
      window.removeEventListener('open-invite-friends', handleOpenInvite);
    };
  }, []);

  const handleSaveProfile = async (updatedData: {
    display_name: string;
    username: string;
    bio: string;
    avatar_id: string;
  }) => {
    const updated = await updateProfile(updatedData);
    setProfile(updated);
    showToast('Profile updated successfully!');
  };

  const handleToggleFollow = async (targetId: number | string) => {
    await toggleFollow(targetId);
    const [flwData, flgData, profData] = await Promise.all([
      getFollowers(),
      getFollowing(),
      getFullProfile(),
    ]);
    setFollowers(flwData);
    setFollowing(flgData);
    setProfile(profData);
  };

  const handleCourseClick = (course: UserCourse) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleFollowersClick = (tab: 'following' | 'followers') => {
    setActiveRightTab(tab);
    // Smooth scroll to right sidebar on mobile/tablet if needed
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/50 border-2 border-red-300 dark:border-red-800 flex items-center justify-center text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Unable to load profile
          </h2>
          <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] mt-1 max-w-sm">
            {error || 'Something went wrong while connecting to the backend server.'}
          </p>
        </div>
        <button
          onClick={fetchProfileData}
          className="px-6 py-3 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#1899d6] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RETRY</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider shadow-lg animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-5 h-5 stroke-[2.5]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Profile Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Center Main Profile Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* 1. Header & User Card */}
          <UserCard
            profile={profile}
            onEditClick={() => setIsEditOpen(true)}
            onFollowersClick={handleFollowersClick}
            onCourseClick={handleCourseClick}
          />

          {/* 2. Statistics Grid Section */}
          <StatsCard stats={profile.stats} />

          {/* 3. Achievements Section */}
          <AchievementsGrid
            achievements={achievements}
            onViewAllClick={() => setIsCourseModalOpen(true)}
          />

          {/* Mobile View: Followers & Add Friends inline below achievements */}
          <div className="block lg:hidden space-y-6 pt-4 border-t-2 border-gray-100 dark:border-[#20323d]">
            <ProfileRightPanel
              profile={profile}
              followers={followers}
              following={following}
              onFindFriendsClick={() => setIsFindFriendsOpen(true)}
              onInviteFriendsClick={() => setIsInviteFriendsOpen(true)}
              onToggleFollow={handleToggleFollow}
              activeTab={activeRightTab}
              onTabChange={setActiveRightTab}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          profile={profile}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Find Friends Modal */}
      {isFindFriendsOpen && (
        <FindFriendsModal
          isOpen={isFindFriendsOpen}
          onClose={() => setIsFindFriendsOpen(false)}
          onToggleFollow={handleToggleFollow}
        />
      )}

      {/* Invite Friends Modal */}
      {isInviteFriendsOpen && (
        <InviteFriendsModal
          isOpen={isInviteFriendsOpen}
          onClose={() => setIsInviteFriendsOpen(false)}
          username={profile.username}
        />
      )}

      {/* Course Detail Modal */}
      {isCourseModalOpen && (
        <CourseModal
          course={selectedCourse || profile.courses[0]}
          isOpen={isCourseModalOpen}
          onClose={() => setIsCourseModalOpen(false)}
        />
      )}
    </div>
  );
}
