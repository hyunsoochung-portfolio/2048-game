// src/components/Tile.js

import React from "react";
import "./Tile.css";

const Tile = ({ value }) => {
  const tileClasses = `tile tile-${value}`;
  return <div className={tileClasses}>{value}</div>;
};

export default Tile;