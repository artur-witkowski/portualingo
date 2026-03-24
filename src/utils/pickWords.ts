import type { WeightedWord } from '../data';
import type { WordPair } from '../data';
import { shuffle } from './shuffle';

/**
 * Pick `count` words from the pool, respecting category weights.
 * Words with lower weight have proportionally less chance of being selected.
 */
export function pickWords(
  allWords: WeightedWord[],
  count: number,
  exclude: Set<string>,
): WordPair[] {
  const available = allWords.filter((w) => !exclude.has(w.pt));

  // Weighted random selection without replacement
  const picked: WordPair[] = [];
  const pool = [...available];

  while (picked.length < count && pool.length > 0) {
    const totalWeight = pool.reduce((sum, w) => sum + w.weight, 0);
    let r = Math.random() * totalWeight;

    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].weight;
      if (r <= 0) {
        picked.push({ pt: pool[i].pt, pl: pool[i].pl });
        pool.splice(i, 1);
        break;
      }
    }
  }

  return shuffle(picked);
}
