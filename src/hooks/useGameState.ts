import { useState, useEffect, useCallback, useRef } from 'react';
import { ALL_WORDS } from '../data';
import type { WordPair } from '../data';
import { shuffle } from '../utils/shuffle';
import { pickWords } from '../utils/pickWords';

// ── Round config ────────────────────────────────────────────────────
const ROUNDS = [
  { pairs: 4, xp: 5 },
  { pairs: 4, xp: 5 },
  { pairs: 5, xp: 10 },
  { pairs: 5, xp: 10 },
  { pairs: 5, xp: 15 },
  { pairs: 5, xp: 15 },
  { pairs: 6, xp: 20 },
  { pairs: 6, xp: 20 },
  { pairs: 6, xp: 50 },
];

export const TOTAL_ROUNDS = ROUNDS.length;
export const TOTAL_TIME = 105;
export const CHECKPOINT_ROUNDS = [2, 5, 8];

export interface CardData {
  id: string;
  text: string;
  pairIdx: number;
}

export type GamePhase = 'idle' | 'playing' | 'checkpoint' | 'complete' | 'timeout';

function buildCards(words: WordPair[]) {
  return {
    left: shuffle(words.map((w, i) => ({ id: `l${i}`, text: w.pt, pairIdx: i }))),
    right: shuffle(words.map((w, i) => ({ id: `r${i}`, text: w.pl, pairIdx: i }))),
  };
}

export function useGameState() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [totalXP, setTotalXP] = useState(0);
  const [roundXP, setRoundXP] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalMatched, setTotalMatched] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const [leftCards, setLeftCards] = useState<CardData[]>([]);
  const [rightCards, setRightCards] = useState<CardData[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<CardData | null>(null);
  const [selectedRight, setSelectedRight] = useState<CardData | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [wrongCards, setWrongCards] = useState<Set<string>>(new Set());
  const [correctCards, setCorrectCards] = useState<Set<string>>(new Set());
  const [checkpointXP, setCheckpointXP] = useState(0);
  const [practicedWords, setPracticedWords] = useState<WordPair[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const usedWordsRef = useRef(new Set<string>());
  const pairsRef = useRef<WordPair[]>([]);

  // ── Timer ──
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setPhase('timeout');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // ── Setup round ──
  const setupRound = useCallback((roundIdx: number, usedWords: Set<string>) => {
    const config = ROUNDS[roundIdx];
    const words = pickWords(ALL_WORDS, config.pairs, usedWords);
    words.forEach((w) => usedWords.add(w.pt));
    pairsRef.current = words;

    const cards = buildCards(words);
    setLeftCards(cards.left);
    setRightCards(cards.right);
    setMatchedPairs(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongCards(new Set());
    setCorrectCards(new Set());
    setRoundXP(0);
  }, []);

  // ── Start game ──
  const startGame = useCallback(() => {
    usedWordsRef.current = new Set();
    setPhase('playing');
    setRound(0);
    setTimeLeft(TOTAL_TIME);
    setTotalXP(0);
    setTotalMatched(0);
    setTotalWrong(0);
    setCombo(0);
    setMaxCombo(0);
    setShowCombo(false);
    setPracticedWords([]);
    setupRound(0, usedWordsRef.current);
  }, [setupRound]);

  // ── Check match ──
  const checkMatch = useCallback(
    (left: CardData, right: CardData, currentRound: number) => {
      if (left.pairIdx === right.pairIdx) {
        // Correct — update state immediately, don't block further clicks
        const matchedWord = pairsRef.current[left.pairIdx];
        const xpGain = ROUNDS[currentRound].xp;

        setMatchedPairs((prev) => {
          const next = new Set(prev);
          next.add(left.pairIdx);
          return next;
        });
        setCorrectCards(new Set([left.id, right.id]));
        setSelectedLeft(null);
        setSelectedRight(null);
        setPracticedWords((prev) => [...prev, matchedWord]);

        setCombo((prev) => {
          const next = prev + 1;
          setMaxCombo((m) => Math.max(m, next));
          if (next >= 3) {
            setShowCombo(true);
            if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
            comboTimerRef.current = setTimeout(() => setShowCombo(false), 1200);
          }
          return next;
        });

        setRoundXP((prev) => prev + xpGain);
        setTotalXP((prev) => prev + xpGain);
        setTotalMatched((prev) => prev + 1);

        // Short visual flash, then check round completion
        setTimeout(() => {
          setCorrectCards(new Set());

          setMatchedPairs((matched) => {
            if (matched.size === pairsRef.current.length) {
              const nextRound = currentRound + 1;
              if (nextRound >= ROUNDS.length) {
                if (timerRef.current) clearInterval(timerRef.current);
                setPhase('complete');
              } else if (CHECKPOINT_ROUNDS.includes(currentRound)) {
                if (timerRef.current) clearInterval(timerRef.current);
                setRoundXP((rx) => {
                  setCheckpointXP(rx);
                  return rx;
                });
                setPhase('checkpoint');
              } else {
                setRound(nextRound);
                setupRound(nextRound, usedWordsRef.current);
              }
            }
            return matched;
          });
        }, 150);
      } else {
        // Wrong — visual shake only, no input blocking
        setWrongCards(new Set([left.id, right.id]));
        setSelectedLeft(null);
        setSelectedRight(null);
        setCombo(0);
        setTotalWrong((prev) => prev + 1);
        setTimeout(() => setWrongCards(new Set()), 250);
      }
    },
    [setupRound],
  );

  // ── Card clicks ──
  const selectLeft = useCallback(
    (card: CardData) => {
      if (matchedPairs.has(card.pairIdx)) return;
      setSelectedLeft(card);
      if (selectedRight && !matchedPairs.has(selectedRight.pairIdx)) {
        checkMatch(card, selectedRight, round);
      }
    },
    [matchedPairs, selectedRight, round, checkMatch],
  );

  const selectRight = useCallback(
    (card: CardData) => {
      if (matchedPairs.has(card.pairIdx)) return;
      setSelectedRight(card);
      if (selectedLeft && !matchedPairs.has(selectedLeft.pairIdx)) {
        checkMatch(selectedLeft, card, round);
      }
    },
    [matchedPairs, selectedLeft, round, checkMatch],
  );

  // ── Continue from checkpoint ──
  const continueFromCheckpoint = useCallback(() => {
    const nextRound = round + 1;
    setRound(nextRound);
    setupRound(nextRound, usedWordsRef.current);
    setPhase('playing');
  }, [round, setupRound]);

  return {
    phase,
    round,
    timeLeft,
    totalXP,
    roundXP,
    combo,
    maxCombo,
    totalMatched,
    totalWrong,
    showCombo,
    leftCards,
    rightCards,
    selectedLeft,
    selectedRight,
    matchedPairs,
    wrongCards,
    correctCards,
    checkpointXP,
    practicedWords,
    roundLabel: `Runda ${round + 1}`,
    roundPairs: ROUNDS[round]?.pairs ?? 0,
    startGame,
    selectLeft,
    selectRight,
    continueFromCheckpoint,
  };
}
