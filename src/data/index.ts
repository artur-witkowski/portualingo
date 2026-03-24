import { verbs } from './verbs';
import { expressions } from './expressions';
import { people } from './people';
import { values } from './values';
import { sports } from './sports';
import { health } from './health';
import { holidays } from './holidays';
import { numbers } from './numbers';
import { days } from './days';
import { shopping } from './shopping';
import { vegetables } from './vegetables';
import { fruits } from './fruits';
import { food } from './food';
import type { Category, WordPair } from './types';

export const categories: Category[] = [
  verbs,
  expressions,
  people,
  values,
  sports,
  health,
  holidays,
  numbers,
  days,
  shopping,
  vegetables,
  fruits,
  food,
];

export interface WeightedWord extends WordPair {
  weight: number;
}

export const ALL_WORDS: WeightedWord[] = categories.flatMap((c) =>
  c.words.map((w) => ({ ...w, weight: c.weight ?? 1 })),
);

export type { WordPair, Category } from './types';
