import { ALL_WORDS } from '../data';
import type { UserProgress } from '../hooks/useProgress';
import s from './StartScreen.module.css';

interface Props {
  progress: UserProgress;
  onStart: () => void;
}

export function StartScreen({ progress, onStart }: Props) {
  return (
    <div className={s.screen}>
      <div className={s.mascot}>🦉</div>
      <div className={s.title}>Match Madness</div>
      <div className={s.flagRow}>
        <span className={s.flagPill}>🇵🇹 Português</span>
        <span className={s.flagPill}>🇵🇱 Polski</span>
      </div>
      <div className={s.subtitle}>
        Dopasuj pary słów w 1:45! Przejdź przez 9 rund i zdobądź jak najwięcej XP.
      </div>

      {progress.gamesPlayed > 0 && (
        <div className={s.stats}>
          <div className={s.stat}>
            <div className={s.statVal}>{progress.totalXP}</div>
            <div className={s.statLabel}>Total XP</div>
          </div>
          <div className={s.stat}>
            <div className={s.statVal}>{progress.bestScore}</div>
            <div className={s.statLabel}>Najlepszy</div>
          </div>
          <div className={s.stat}>
            <div className={s.statVal}>🔥 {progress.streak.current}</div>
            <div className={s.statLabel}>Streak</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <button className={s.btn} onClick={onStart}>
          Zaczynamy!
        </button>
      </div>
      <div className={s.wordCount}>{ALL_WORDS.length} słówek w bazie</div>
    </div>
  );
}
