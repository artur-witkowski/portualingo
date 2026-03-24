import s from './ResultsScreen.module.css';

interface Props {
  variant: 'complete' | 'timeout';
  totalXP: number;
  totalMatched: number;
  totalWrong: number;
  maxCombo: number;
  timeLeft: number;
  roundLabel: string;
  onPlayAgain: () => void;
}

function formatTime(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export function ResultsScreen({
  variant,
  totalXP,
  totalMatched,
  totalWrong,
  maxCombo,
  timeLeft,
  roundLabel,
  onPlayAgain,
}: Props) {
  if (variant === 'timeout') {
    return (
      <div className={s.screen}>
        <div className={s.mascot}>⏰</div>
        <div className={s.title} style={{ color: 'var(--red)' }}>
          Czas minął!
        </div>
        <div className={s.subtitle}>
          Udało Ci się dojść do {roundLabel} i zdobyć {totalXP} XP.
        </div>
        <div className={s.stats}>
          <div className={s.stat}>
            <div className={s.statVal}>{totalMatched}</div>
            <div className={s.statLabel}>Dopasowań</div>
          </div>
          <div className={s.stat}>
            <div className={s.statVal} style={{ color: 'var(--red)' }}>
              {totalWrong}
            </div>
            <div className={s.statLabel}>Błędów</div>
          </div>
          <div className={s.stat}>
            <div className={s.statVal} style={{ color: 'var(--yellow)' }}>
              {totalXP}
            </div>
            <div className={s.statLabel}>XP</div>
          </div>
        </div>
        <button className={s.btn} onClick={onPlayAgain}>
          Spróbuj ponownie!
        </button>
      </div>
    );
  }

  return (
    <div className={s.screen}>
      <div className={s.mascot}>🏆</div>
      <div className={s.title} style={{ color: 'var(--yellow)' }}>
        Fantastycznie!
      </div>
      <div className={s.xp}>+{totalXP} XP</div>
      <div className={s.stats}>
        <div className={s.stat}>
          <div className={s.statVal}>{totalMatched}</div>
          <div className={s.statLabel}>Dopasowań</div>
        </div>
        <div className={s.stat}>
          <div className={s.statVal} style={{ color: 'var(--orange)' }}>
            x{maxCombo}
          </div>
          <div className={s.statLabel}>Max combo</div>
        </div>
        <div className={s.stat}>
          <div
            className={s.statVal}
            style={{ color: timeLeft > 0 ? 'var(--blue)' : 'var(--red)' }}
          >
            {formatTime(timeLeft)}
          </div>
          <div className={s.statLabel}>Pozostało</div>
        </div>
      </div>
      <div className={s.actions}>
        <button className={s.btn} onClick={onPlayAgain}>
          Jeszcze raz!
        </button>
      </div>
    </div>
  );
}
