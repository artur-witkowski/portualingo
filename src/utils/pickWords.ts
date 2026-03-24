import type { WordPair } from '../data';
import { shuffle } from './shuffle';

export function pickWords(
  allWords: WordPair[],
  count: number,
  exclude: Set<string>,
): WordPair[] {
  const available = allWords.filter((w) => !exclude.has(w.pt));
  return shuffle(available).slice(0, count);
}
