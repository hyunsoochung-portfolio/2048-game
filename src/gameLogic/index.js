// src/gameLogic/index.js

// 타입 정의 (TypeScript가 아니더라도 가독성을 위해 추가)
// Cell: 타일의 값 (숫자 또는 null)
// Map2048: 2차원 배열로 된 게임 맵
// Direction: 이동 방향
// RotateDegree: 회전 각도
// DirectionDegreeMap: 방향-각도 매핑
// MoveResult: 이동 결과와 이동 여부

/**
 * 2048 게임에서, Map을 특정 방향으로 이동했을 때 결과를 반환하는 함수입니다.
 * @param map 2048 맵. 빈 공간은 null 입니다.
 * @param direction 이동 방향
 * @returns 이동 방향에 따른 결과와 이동되었는지 여부
 */
export const moveMapIn2048Rule = (map, direction) => {
  if (!validateMapIsNByM(map)) throw new Error("Map is not N by M");

  const rotatedMap = rotateMapCounterClockwise(map, rotateDegreeMap[direction]);

  const { result, isMoved } = moveLeft(rotatedMap);

  return {
    result: rotateMapCounterClockwise(result, revertDegreeMap[direction]),
    isMoved,
  };
};

// 맵이 N x M 형태인지 검증하는 함수
const validateMapIsNByM = (map) => {
  const firstColumnCount = map[0].length;
  return map.every((row) => row.length === firstColumnCount);
};

// 맵을 반시계 방향으로 회전시키는 함수
const rotateMapCounterClockwise = (map, degree) => {
  const rowLength = map.length;
  const columnLength = map[0].length;

  switch (degree) {
    case 0:
      return map;
    case 90:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex) => map[rowIndex][columnLength - columnIndex - 1],
        ),
      );
    case 180:
      return Array.from({ length: rowLength }, (_, rowIndex) =>
        Array.from(
          { length: columnLength },
          (_, columnIndex) =>
            map[rowLength - rowIndex - 1][columnLength - columnIndex - 1],
        ),
      );
    case 270:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex) => map[rowLength - rowIndex - 1][columnIndex],
        ),
      );
  }
};

// 맵을 왼쪽으로 이동시키는 함수
const moveLeft = (map) => {
  const movedRows = map.map(moveRowLeft);
  const result = movedRows.map((movedRow) => movedRow.result);
  const isMoved = movedRows.some((movedRow) => movedRow.isMoved);
  return { result, isMoved };
};

// 한 행(row)을 왼쪽으로 이동시키는 함수
const moveRowLeft = (row) => {
  const reduced = row.reduce(
    (acc, cell) => {
      if (cell === null) {
        return acc;
      } else if (acc.lastCell === null) {
        return { ...acc, lastCell: cell };
      } else if (acc.lastCell === cell) {
        return { result: [...acc.result, cell * 2], lastCell: null };
      } else {
        return { result: [...acc.result, acc.lastCell], lastCell: cell };
      }
    },
    { lastCell: null, result: [] },
  );

  const result = [...reduced.result, reduced.lastCell];
  const resultRow = Array.from(
    { length: row.length },
    (_, i) => result[i] ?? null,
  );

  return {
    result: resultRow,
    isMoved: row.some((cell, i) => cell !== resultRow[i]),
  };
};

// 방향에 따른 회전 각도 매핑
const rotateDegreeMap = {
  up: 90,
  right: 180,
  down: 270,
  left: 0,
};

// 되돌리기 회전 각도 매핑
const revertDegreeMap = {
  up: 270,
  right: 180,
  down: 90,
  left: 0,
};