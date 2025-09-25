// src/components/Board.js

import React from "react";
import Tile from "./Tile";
import "./Tile.css";

const Board = ({ map }) => {
  return (
    <div className="board-grid">
      {/* 2차원 맵 배열을 순회하여 모든 타일 또는 빈 셀을 렌더링합니다. */}
      {map.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          // 빈 타일일 경우, 배경 타일 div를 렌더링
          tile === null ? (
            <div key={`${rowIndex}-${colIndex}`} className="board-cell-background" />
          ) : (
            // 타일이 있을 경우, Tile 컴포넌트 렌더링
            <Tile key={`${rowIndex}-${colIndex}`} value={tile} />
          )
        )),
      )}
    </div>
  );
};

export default Board;