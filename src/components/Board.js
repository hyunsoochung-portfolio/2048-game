
import React from "react";
import Tile from "./Tile";
import "./Tile.css";

const Board = ({ map }) => {
  return (
    <div className="board-grid">

      {map.map((row, rowIndex) =>
        row.map((tile, colIndex) => (

          tile === null ? (
            <div key={`${rowIndex}-${colIndex}`} className="board-cell-background" />
          ) : (

            <Tile key={`${rowIndex}-${colIndex}`} value={tile} />
          )
        )),
      )}
    </div>
  );
};

export default Board;
