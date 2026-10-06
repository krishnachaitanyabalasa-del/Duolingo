import React from 'react';
import { SoundsPage } from '@/components/sounds/SoundsPage';

export const metadata = {
  title: 'Sounds — Duolingo',
  description: 'Master English pronunciation sounds, vowels, and consonants.',
};

export default function SoundsRoute() {
  return <SoundsPage />;
}
