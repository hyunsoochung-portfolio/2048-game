import { useState, useEffect, useCallback } from "react";
import { moveMapIn2048Rule } from "../gameLogic";

// 게임 상수
const MAP_SIZE = 4;
const INITIAL_TILES_COUNT = 2;
const LOCAL_STORAGE_KEY = '2048_game_state';
const MAX_UNDO_COUNT = 2; // 최대 언두 횟수

// 빈 맵 생성 함수
const createEmptyMap = () =>
  Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(null));

// 빈 셀에 2 또는 4 타일을 무작위로 추가하는 함수
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

// 게임 오버 여부를 확인하는 함수
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
  // 로컬 스토리지에서 초기 상태를 가져오는 함수
  const getInitialState = () => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // undo 스택과 카운트가 없을 경우 기본값 설정
        if (!parsedState.undoStack) parsedState.undoStack = [];
        if (!parsedState.undoCount) parsedState.undoCount = 0;
        return parsedState;
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
    }

    // 저장된 상태가 없으면 초기 게임 상태 생성
    let initialMap = createEmptyMap();
    for (let i = 0; i < INITIAL_TILES_COUNT; i++) {
      initialMap = addRandomTile(initialMap);
    }
    return { map: initialMap, score: 0, status: "playing", undoStack: [], undoCount: 0 };
  };

  const [gameState, setGameState] = useState(getInitialState);
  const { map, score, status, undoStack, undoCount } = gameState;

  // 게임 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // 게임 초기화
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

  // undo 기능
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

  // 키보드 입력 처리
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