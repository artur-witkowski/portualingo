import { useLocalStorage } from './useLocalStorage';
import type { WordPair } from '../data';

export interface UserProgress {
  version: 1;
  totalXP: number;
  bestScore: number;
  gamesPlayed: number;
  streak: {
    current: number;
    lastPlayedDate: string;
  };
  practicedWords: Record<string, number>;
}

const DEFAULT_PROGRESS: UserProgress = {
  version: 1,
  totalXP: 0,
  bestScore: 0,
  gamesPlayed: 0,
  streak: { current: 0, lastPlayedDate: '' },
  practicedWords: {},
};

function todayStr(): string {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
}

function updateStreak(streak: UserProgress['streak']): UserProgress['streak'] {
  const today = todayStr();
  if (streak.lastPlayedDate === today) {
    return streak; // already played today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  if (streak.lastPlayedDate === yesterdayStr) {
    return { current: streak.current + 1, lastPlayedDate: today };
  }

  return { current: 1, lastPlayedDate: today };
}

function mergePracticed(
  existing: Record<string, number>,
  words: WordPair[],
): Record<string, number> {
  const result = { ...existing };
  for (const w of words) {
    const key = `${w.pt}:${w.pl}`;
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    'portualingo_progress',
    DEFAULT_PROGRESS,
  );

  const addGameResult = (xp: number, wordsPlayed: WordPair[]) => {
    setProgress((prev) => ({
      ...prev,
      totalXP: prev.totalXP + xp,
      bestScore: Math.max(prev.bestScore, xp),
      gamesPlayed: prev.gamesPlayed + 1,
      streak: updateStreak(prev.streak),
      practicedWords: mergePracticed(prev.practicedWords, wordsPlayed),
    }));
  };

  return { progress, addGameResult };
}
