import { useRef, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useProgress } from './hooks/useProgress';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { CheckpointOverlay } from './components/CheckpointOverlay';

export default function App() {
  const game = useGameState();
  const { progress, addGameResult } = useProgress();
  const savedRef = useRef(false);

  // Save progress when game ends
  useEffect(() => {
    if ((game.phase === 'complete' || game.phase === 'timeout') && !savedRef.current) {
      savedRef.current = true;
      addGameResult(game.totalXP, game.practicedWords);
    }
    if (game.phase === 'idle' || game.phase === 'playing') {
      savedRef.current = false;
    }
  }, [game.phase, game.totalXP, game.practicedWords, addGameResult]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: 16 }}>
      {game.phase === 'idle' && (
        <StartScreen progress={progress} onStart={game.startGame} />
      )}

      {game.phase === 'playing' && (
        <GameScreen
          round={game.round}
          timeLeft={game.timeLeft}
          totalXP={game.totalXP}
          roundLabel={game.roundLabel}
          roundPairs={game.roundPairs}
          combo={game.combo}
          showCombo={game.showCombo}
          leftCards={game.leftCards}
          rightCards={game.rightCards}
          selectedLeft={game.selectedLeft}
          selectedRight={game.selectedRight}
          matchedPairs={game.matchedPairs}
          wrongCards={game.wrongCards}
          correctCards={game.correctCards}
          onSelectLeft={game.selectLeft}
          onSelectRight={game.selectRight}
        />
      )}

      {game.phase === 'checkpoint' && (
        <>
          <GameScreen
            round={game.round}
            timeLeft={game.timeLeft}
            totalXP={game.totalXP}
            roundLabel={game.roundLabel}
            roundPairs={game.roundPairs}
            combo={game.combo}
            showCombo={false}
            leftCards={game.leftCards}
            rightCards={game.rightCards}
            selectedLeft={null}
            selectedRight={null}
            matchedPairs={game.matchedPairs}
            wrongCards={new Set()}
            correctCards={new Set()}
            onSelectLeft={() => {}}
            onSelectRight={() => {}}
          />
          <CheckpointOverlay xp={game.checkpointXP} onContinue={game.continueFromCheckpoint} />
        </>
      )}

      {game.phase === 'complete' && (
        <ResultsScreen
          variant="complete"
          totalXP={game.totalXP}
          totalMatched={game.totalMatched}
          totalWrong={game.totalWrong}
          maxCombo={game.maxCombo}
          timeLeft={game.timeLeft}
          roundLabel={game.roundLabel}
          onPlayAgain={game.startGame}
        />
      )}

      {game.phase === 'timeout' && (
        <ResultsScreen
          variant="timeout"
          totalXP={game.totalXP}
          totalMatched={game.totalMatched}
          totalWrong={game.totalWrong}
          maxCombo={game.maxCombo}
          timeLeft={game.timeLeft}
          roundLabel={game.roundLabel}
          onPlayAgain={game.startGame}
        />
      )}
    </div>
  );
}
