import s from './CheckpointOverlay.module.css';

interface Props {
  xp: number;
  onContinue: () => void;
}

export function CheckpointOverlay({ xp, onContinue }: Props) {
  return (
    <div className={s.overlay}>
      <div className={s.card}>
        <div className={s.icon}>⭐</div>
        <div className={s.title}>Checkpoint!</div>
        <div className={s.xp}>+{xp} XP</div>
        <div className={s.hint}>Świetnie! Kontynuuj do następnych rund.</div>
        <button className={s.btn} onClick={onContinue}>
          Dalej!
        </button>
      </div>
    </div>
  );
}
