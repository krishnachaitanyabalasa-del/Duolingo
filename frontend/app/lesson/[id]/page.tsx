import React from 'react';
import LessonClient from './LessonClient';

export function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({ id: (i + 1).toString() })).concat([
    { id: 'sk_food' },
    { id: 'sk_greetings' },
    { id: 'sk_introductions' },
    { id: 'sk_phrases' },
  ]);
}

export default function LessonPage() {
  return <LessonClient />;
}
