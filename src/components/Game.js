// src/components/Game.js

import React from "react";
import { use2048Game } from "../hooks/use2048Game";
import Board from "./Board";

const Game = () => {
  const { map, score, status, resetGame, undoLastMove, undoCount } = use2048Game();

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>2048</h1>
        <div className="game-controls">
          <div className="score-board">
            Score: <span className="score">{score}</span>
          </div>
          <button onClick={resetGame}>새 게임</button>
          <button 
            onClick={undoLastMove} 
            disabled={status !== "playing" || undoCount >= 2}
          >
            Undo ({2 - undoCount}/2)
          </button>
        </div>
      </div>
      <Board map={map} />
      {status !== "playing" && (
        <div className="game-over-overlay">
          <p>{status === "win" ? "승리했습니다!" : "게임 오버!"}</p>
        </div>
      )}
    </div>
  );
};

export default Game;
