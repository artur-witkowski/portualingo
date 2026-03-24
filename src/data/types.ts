export interface WordPair {
  pt: string;
  pl: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  words: WordPair[];
  /** Probability weight for random selection (default: 1). Lower = less likely. */
  weight?: number;
}
