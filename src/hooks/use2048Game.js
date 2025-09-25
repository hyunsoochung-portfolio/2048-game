import { useState, useEffect, useCallback } from "react";
import { moveMapIn2048Rule } from "../gameLogic";


const MAP_SIZE = 4;
const INITIAL_TILES_COUNT = 2;
const LOCAL_STORAGE_KEY = '2048_game_state';
const MAX_UNDO_COUNT = 2; 


const createEmptyMap = () =>
  Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(null));


const addRandomTile = (map) => {
  const emptyCells = [];
  for (let r = 0; r < MAP_SIZE; r++) {
    for (let c = 0; c < MAP_SIZE; c++) {
      if (map[r][c] === null) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;
    const newMap = map.map((row) => [...row]);
    newMap[randomCell.r][randomCell.c] = newValue;
    return newMap;
  }
  return map;
};

const checkGameOver = (map) => {
  for (let r = 0; r < MAP_SIZE; r++) {
    for (let c = 0; c < MAP_SIZE; c++) {
      if (map[r][c] === null) return false;
    }
  }

  const directions = ["up", "down", "left", "right"];
  for (const direction of directions) {
    const { isMoved } = moveMapIn2048Rule(map, direction);
    if (isMoved) return false;
  }

  return true;
};

export const use2048Game = () => {

  const getInitialState = () => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        if (!parsedState.undoStack) parsedState.undoStack = [];
        if (!parsedState.undoCount) parsedState.undoCount = 0;
        return parsedState;
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
    }


    let initialMap = createEmptyMap();
    for (let i = 0; i < INITIAL_TILES_COUNT; i++) {
      initialMap = addRandomTile(initialMap);
    }
    return { map: initialMap, score: 0, status: "playing", undoStack: [], undoCount: 0 };
  };

  const [gameState, setGameState] = useState(getInitialState);
  const { map, score, status, undoStack, undoCount } = gameState;


  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const resetGame = useCallback(() => {
    let initialMap = createEmptyMap();
    for (let i = 0; i < INITIAL_TILES_COUNT; i++) {
      initialMap = addRandomTile(initialMap);
    }
    setGameState({
      map: initialMap,
      score: 0,
      status: "playing",
      undoStack: [],
      undoCount: 0,
    });
  }, []);

  const undoLastMove = useCallback(() => {
    if (undoCount >= MAX_UNDO_COUNT || undoStack.length === 0) {
      return;
    }

    const lastState = undoStack[undoStack.length - 1];
    setGameState({
      map: lastState.map,
      score: lastState.score,
      status: "playing",
      undoStack: undoStack.slice(0, -1),
      undoCount: undoCount + 1,
    });
  }, [undoStack, undoCount]);

  const handleKeyDown = useCallback(
    (event) => {
      if (status !== "playing") return;

      const direction = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      }[event.key];

      if (direction) {
        event.preventDefault();
        const { result, isMoved } = moveMapIn2048Rule(map, direction);

        if (isMoved) {
          const newUndoStack = [...undoStack, { map, score }];
          if (newUndoStack.length > MAX_UNDO_COUNT + 1) {
            newUndoStack.shift();
          }

          const newMapWithTile = addRandomTile(result);
          
          let newScore = score;
          const mapFlat = map.flat();
          const newMapFlat = newMapWithTile.flat();
          for (let i = 0; i < mapFlat.length; i++) {
            if (mapFlat[i] !== newMapFlat[i] && newMapFlat[i] !== null) {
              if (mapFlat[i] !== null && newMapFlat[i] === mapFlat[i] * 2) {
                newScore += newMapFlat[i];
              }
            }
          }

          const newStatus = newMapWithTile.flat().includes(2048) ? "win" :
                            checkGameOver(newMapWithTile) ? "game-over" : "playing";

          setGameState({
            map: newMapWithTile,
            score: newScore,
            status: newStatus,
            undoStack: newUndoStack,
            undoCount: undoCount,
          });
        }
      }
    },
    [map, score, status, undoStack, undoCount],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return { map, score, status, resetGame, undoLastMove, undoCount };
};
