'use client';

import React from 'react';

export interface AvatarOption {
  id: string;
  name: string;
  description: string;
  bgGradient: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'avatar_01', name: 'Alex', description: 'Blue hoodie & headphones', bgGradient: 'from-sky-400 to-blue-600' },
  { id: 'avatar_02', name: 'Maya', description: 'Brown hair & yellow sweater', bgGradient: 'from-amber-400 to-orange-500' },
  { id: 'avatar_03', name: 'Leo', description: 'Glasses & green shirt', bgGradient: 'from-emerald-400 to-green-600' },
  { id: 'avatar_04', name: 'Zoe', description: 'Red hoodie & star emblem', bgGradient: 'from-rose-400 to-pink-600' },
  { id: 'avatar_05', name: 'Sam', description: 'Red cap & backpack', bgGradient: 'from-purple-400 to-indigo-600' },
  { id: 'avatar_06', name: 'Kai', description: 'Curly hair & yellow scarf', bgGradient: 'from-yellow-400 to-amber-600' },
  { id: 'avatar_07', name: 'Mia', description: 'Pink beanie & headphones', bgGradient: 'from-fuchsia-400 to-pink-500' },
  { id: 'avatar_08', name: 'Noah', description: 'Denim jacket & glasses', bgGradient: 'from-cyan-400 to-blue-500' },
];

interface CartoonAvatarProps {
  avatarId?: string;
  avatarUrl?: string;
  size?: number | string;
  showDashedBorder?: boolean;
  className?: string;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  avatarId = 'avatar_01',
  avatarUrl,
  size = 96,
  showDashedBorder = false,
  className = '',
}) => {
  const avatar = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
  const url =
    avatarUrl ||
    (avatarId && !avatarId.startsWith('avatar_0')
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
      : null);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none shadow-md ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      {url ? (
        <div className="w-full h-full rounded-full bg-[#e5e5e5] dark:bg-[#182730] flex items-center justify-center overflow-hidden shadow-inner">
          <img src={url} alt="Cartoon Avatar" className="w-full h-full object-cover" />
        </div>
      ) : (
        <>
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${avatar.bgGradient}`} />

          {/* SVG Cartoon Character Illustration */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10 p-1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {avatarId === 'avatar_02' ? (
              <g>
                <circle cx="50" cy="40" r="32" fill="#4A2E2B" />
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#FFC800" />
                <path d="M42 60 L50 72 L58 60 Z" fill="#E6A100" />
                <rect x="44" y="48" width="12" height="15" rx="3" fill="#FBD3B6" />
                <circle cx="50" cy="42" r="22" fill="#FBD3B6" />
                <circle cx="43" cy="40" r="3" fill="#2D3748" />
                <circle cx="57" cy="40" r="3" fill="#2D3748" />
                <circle cx="44" cy="39" r="1" fill="#FFFFFF" />
                <circle cx="58" cy="39" r="1" fill="#FFFFFF" />
                <circle cx="39" cy="45" r="3" fill="#FF8A8A" opacity="0.6" />
                <circle cx="61" cy="45" r="3" fill="#FF8A8A" opacity="0.6" />
                <path d="M44 47 Q50 53 56 47" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 35 Q40 20 50 30 Q60 20 72 35" fill="#4A2E2B" />
              </g>
            ) : avatarId === 'avatar_03' ? (
              <g>
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#58CC02" />
                <rect x="44" y="48" width="12" height="15" rx="3" fill="#F9C99D" />
                <circle cx="50" cy="40" r="22" fill="#F9C99D" />
                <path d="M28 38 C28 20, 72 20, 72 38 C65 24, 35 24, 28 38 Z" fill="#2C1D11" />
                <rect x="35" y="36" width="13" height="10" rx="3" fill="none" stroke="#1A202C" strokeWidth="2.5" />
                <rect x="52" y="36" width="13" height="10" rx="3" fill="none" stroke="#1A202C" strokeWidth="2.5" />
                <line x1="48" y1="41" x2="52" y2="41" stroke="#1A202C" strokeWidth="2.5" />
                <circle cx="41.5" cy="41" r="2" fill="#2D3748" />
                <circle cx="58.5" cy="41" r="2" fill="#2D3748" />
                <path d="M44 50 Q50 55 56 50" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : avatarId === 'avatar_04' ? (
              <g>
                <path d="M22 35 C20 60, 30 75, 32 85 M78 35 C80 60, 70 75, 68 85" stroke="#8C1D40" strokeWidth="16" strokeLinecap="round" />
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#FF4B4B" />
                <polygon points="50,68 53,74 59,74 54,78 56,84 50,80 44,84 46,78 41,74 47,74" fill="#FFD700" />
                <rect x="44" y="48" width="12" height="15" rx="3" fill="#FED7AA" />
                <circle cx="50" cy="40" r="22" fill="#FED7AA" />
                <ellipse cx="42" cy="40" rx="2.5" ry="3.5" fill="#2D3748" />
                <ellipse cx="58" cy="40" rx="2.5" ry="3.5" fill="#2D3748" />
                <path d="M43 48 Q50 54 57 48" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M28 32 C35 22, 65 22, 72 32 C65 25, 35 25, 28 32 Z" fill="#8C1D40" />
              </g>
            ) : avatarId === 'avatar_05' ? (
              <g>
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#CE82FF" />
                <rect x="44" y="48" width="12" height="15" rx="3" fill="#FBD3B6" />
                <circle cx="50" cy="42" r="21" fill="#FBD3B6" />
                <path d="M26 36 C26 22, 74 22, 74 36 Z" fill="#9333EA" />
                <path d="M20 36 C20 36, 40 33, 56 36 L78 36" stroke="#7E22CE" strokeWidth="5" strokeLinecap="round" fill="none" />
                <circle cx="42" cy="42" r="3" fill="#2D3748" />
                <circle cx="58" cy="42" r="3" fill="#2D3748" />
                <path d="M45 49 Q50 54 55 49" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            ) : avatarId === 'avatar_06' ? (
              <g>
                <circle cx="34" cy="30" r="10" fill="#3B2314" />
                <circle cx="45" cy="24" r="11" fill="#3B2314" />
                <circle cx="56" cy="24" r="11" fill="#3B2314" />
                <circle cx="66" cy="30" r="10" fill="#3B2314" />
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#1CB0F6" />
                <path d="M30 62 Q50 72 70 62 Q50 58 30 62 Z" fill="#FFD700" />
                <rect x="44" y="48" width="12" height="15" rx="3" fill="#F5C39B" />
                <circle cx="50" cy="42" r="21" fill="#F5C39B" />
                <circle cx="43" cy="41" r="3" fill="#2D3748" />
                <circle cx="57" cy="41" r="3" fill="#2D3748" />
                <path d="M44 48 Q50 53 56 48" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            ) : avatarId === 'avatar_07' ? (
              <g>
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#EC4899" />
                <circle cx="50" cy="42" r="21" fill="#FCD34D" />
                <path d="M27 38 C27 20, 73 20, 73 38 Z" fill="#DB2777" />
                <rect x="25" y="34" width="50" height="7" rx="3" fill="#BE185D" />
                <circle cx="50" cy="18" r="6" fill="#F472B6" />
                <circle cx="42" cy="44" r="3" fill="#2D3748" />
                <circle cx="58" cy="44" r="3" fill="#2D3748" />
                <path d="M44 50 Q50 55 56 50" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            ) : avatarId === 'avatar_08' ? (
              <g>
                <path d="M26 36 Q38 18 50 20 Q62 18 74 36 Z" fill="#1F2937" />
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#2563EB" />
                <rect x="44" y="48" width="12" height="15" rx="3" fill="#F9C99D" />
                <circle cx="50" cy="42" r="21" fill="#F9C99D" />
                <circle cx="41" cy="41" r="7" fill="none" stroke="#374151" strokeWidth="2.5" />
                <circle cx="59" cy="41" r="7" fill="none" stroke="#374151" strokeWidth="2.5" />
                <line x1="48" y1="41" x2="52" y2="41" stroke="#374151" strokeWidth="2.5" />
                <circle cx="41" cy="41" r="2" fill="#1F2937" />
                <circle cx="59" cy="41" r="2" fill="#1F2937" />
                <path d="M44 51 Q50 56 56 51" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <g>
                <path d="M24 45 C24 20, 76 20, 76 45" fill="none" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
                <path d="M22 88 C22 68, 35 60, 50 60 C65 60, 78 68, 78 88 Z" fill="#1CB0F6" />
                <line x1="46" y1="62" x2="46" y2="76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <line x1="54" y1="62" x2="54" y2="76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <rect x="44" y="48" width="12" height="15" rx="3" fill="#FBD3B6" />
                <circle cx="50" cy="40" r="22" fill="#FBD3B6" />
                <path d="M28 35 C28 20, 72 20, 72 35 C62 25, 38 25, 28 35 Z" fill="#1A202C" />
                <circle cx="42" cy="40" r="3" fill="#2D3748" />
                <circle cx="58" cy="40" r="3" fill="#2D3748" />
                <circle cx="43" cy="39" r="1" fill="#FFFFFF" />
                <circle cx="59" cy="39" r="1" fill="#FFFFFF" />
                <path d="M44 48 Q50 54 56 48" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <rect x="22" y="36" width="7" height="14" rx="3.5" fill="#0284C7" />
                <rect x="71" y="36" width="7" height="14" rx="3.5" fill="#0284C7" />
              </g>
            )}
          </svg>
        </>
      )}

      {/* Dashed outer outline */}
      {showDashedBorder && (
        <div className="absolute -inset-2 rounded-full border-4 border-dashed border-sky-400/80 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
