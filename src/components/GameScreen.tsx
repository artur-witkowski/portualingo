import { TOTAL_TIME, TOTAL_ROUNDS, CHECKPOINT_ROUNDS } from '../hooks/useGameState';
import type { CardData } from '../hooks/useGameState';
import s from './GameScreen.module.css';

interface Props {
  round: number;
  timeLeft: number;
  totalXP: number;
  roundLabel: string;
  roundPairs: number;
  combo: number;
  showCombo: boolean;
  leftCards: CardData[];
  rightCards: CardData[];
  selectedLeft: CardData | null;
  selectedRight: CardData | null;
  matchedPairs: Set<number>;
  wrongCards: Set<string>;
  correctCards: Set<string>;
  onSelectLeft: (card: CardData) => void;
  onSelectRight: (card: CardData) => void;
}

function formatTime(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export function GameScreen({
  round,
  timeLeft,
  totalXP,
  roundLabel,
  roundPairs,
  combo,
  showCombo,
  leftCards,
  rightCards,
  selectedLeft,
  selectedRight,
  matchedPairs,
  wrongCards,
  correctCards,
  onSelectLeft,
  onSelectRight,
}: Props) {
  const timerPct = (timeLeft / TOTAL_TIME) * 100;
  const timerColor =
    timeLeft > 30 ? 'var(--green)' : timeLeft > 15 ? 'var(--orange)' : 'var(--red)';

  const getCardClass = (card: CardData, side: 'left' | 'right') => {
    const classes = [s.card];
    if (matchedPairs.has(card.pairIdx)) {
      classes.push(s.matched);
    } else if (wrongCards.has(card.id)) {
      classes.push(s.wrong);
    } else if (correctCards.has(card.id)) {
      classes.push(s.correctFlash);
    } else if (side === 'left' && selectedLeft?.id === card.id) {
      classes.push(s.selected);
    } else if (side === 'right' && selectedRight?.id === card.id) {
      classes.push(s.selected);
    }
    return classes.join(' ');
  };

  return (
    <>
      {/* Header */}
      <div className={s.header}>
        <div className={s.timerBarBg}>
          <div
            className={s.timerBarFill}
            style={{ width: `${timerPct}%`, background: timerColor }}
          />
        </div>
        <div className={s.timerText} style={{ color: timerColor }}>
          {formatTime(timeLeft)}
        </div>
        <div className={s.xpBadge}>⚡ {totalXP}</div>
      </div>

      {/* Round info */}
      <div className={s.roundInfo}>
        <div className={s.roundLabel}>{roundLabel}</div>
        <div className={s.roundTitle}>Dopasuj {roundPairs} par!</div>
      </div>

      {/* Progress dots */}
      <div className={s.progress}>
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={[
              s.dot,
              i < round ? s.dotDone : '',
              i === round ? s.dotActive : '',
              CHECKPOINT_ROUNDS.includes(i) ? s.dotCheckpoint : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>

      {/* Combo */}
      {showCombo && <div className={s.combo}>🔥 Combo x{combo}!</div>}

      {/* Grid */}
      <div className={s.grid}>
        <div className={s.col}>
          <div className={s.colHeader}>🇵🇹 Português</div>
          {leftCards.map((card) => (
            <div
              key={card.id}
              className={getCardClass(card, 'left')}
              onClick={() => onSelectLeft(card)}
            >
              {card.text}
            </div>
          ))}
        </div>
        <div className={s.col}>
          <div className={s.colHeader}>🇵🇱 Polski</div>
          {rightCards.map((card) => (
            <div
              key={card.id}
              className={getCardClass(card, 'right')}
              onClick={() => onSelectRight(card)}
            >
              {card.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
