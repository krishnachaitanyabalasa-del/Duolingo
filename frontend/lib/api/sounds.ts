import { apiFetch } from './client';

export interface SoundItem {
  id: number;
  symbol: string;
  example_word: string;
  example_translation?: string;
  audio_text: string;
  progress_percent: number;
  mastered: boolean;
}

export interface SoundCategory {
  id: number;
  name: string;
  slug: string;
  sounds: SoundItem[];
}

export interface SoundsOverviewResponse {
  categories: SoundCategory[];
}

export interface SoundDetailResponse {
  id: number;
  symbol: string;
  example_word: string;
  example_translation?: string;
  category: string;
  audio_text: string;
  progress_percent: number;
  practice_count: number;
  correct_count: number;
  incorrect_count: number;
  mastered: boolean;
}

export interface PracticeSoundResponse {
  sound_id: number;
  practice_count: number;
  correct_count: number;
  incorrect_count: number;
  progress_percent: number;
  mastered: boolean;
}

export async function getSounds(): Promise<SoundsOverviewResponse | null> {
  return await apiFetch<SoundsOverviewResponse>('/api/sounds');
}

export async function getSound(soundId: number): Promise<SoundDetailResponse | null> {
  return await apiFetch<SoundDetailResponse>(`/api/sounds/${soundId}`);
}

export async function practiceSound(soundId: number, correct: boolean): Promise<PracticeSoundResponse | null> {
  return await apiFetch<PracticeSoundResponse>(`/api/sounds/${soundId}/practice`, {
    method: 'POST',
    body: JSON.stringify({ correct }),
  });
}
