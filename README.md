# 2048 — React Puzzle Game

> _Slide, merge, and chase 2048 — a clean React implementation built on a custom hook and a pure, testable game engine._

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?logo=javascript&logoColor=black)
![Create React App](https://img.shields.io/badge/CRA-react--scripts%205-09D3AC?logo=createreactapp&logoColor=white)
![Jest](https://img.shields.io/badge/Tested%20with-Jest%20%2B%20RTL-C21325?logo=jest&logoColor=white)
![CI/CD](https://img.shields.io/badge/Deploy-S3%20%2B%20CloudFront-FF9900?logo=amazonaws&logoColor=white)

**[▶ Play it live](https://2048-game-seven-sepia.vercel.app)**

## Overview

A faithful implementation of the classic 2048 sliding-tile puzzle, written in React 19. The application cleanly separates a **pure, framework-agnostic game engine** (`src/gameLogic`) from a **stateful custom hook** (`use2048Game`) that orchestrates rendering, persistence, and input. All move/merge mathematics is expressed as side-effect-free functions over a 4×4 matrix, which keeps the core rules trivially unit-testable and the React layer thin. Game progress survives reloads via `localStorage`, and a limited undo stack lets players take back recent moves.

## Technical Highlights

- **Rotate-then-collapse move engine.** Rather than implementing four separate directional algorithms, `moveMapIn2048Rule` normalizes every move into a single "collapse left" operation by rotating the board counter-clockwise, collapsing, then rotating back. Direction-to-angle lookups (`rotateDegreeMap` / `revertDegreeMap`) drive the transform — `up` → 90°, `right` → 180°, `down` → 270°, `left` → 0°.
- **Immutable, reduce-based row merge.** `moveRowLeft` collapses a single row using a `reduce` that tracks a `lastCell` accumulator: nulls are dropped, equal adjacent tiles fuse into `cell * 2`, and unequal tiles flush forward — guaranteeing each tile merges at most once per move. An `isMoved` flag is derived by diffing the row against its result.
- **Custom `use2048Game` hook.** A single hook encapsulates the entire game lifecycle — board state, score, status (`playing` / `win` / `game-over`), the undo stack, and undo count — and exposes a minimal API (`map`, `score`, `status`, `resetGame`, `undoLastMove`, `undoCount`) so UI components stay declarative.
- **localStorage persistence.** A `useEffect` serializes the full game state to `localStorage` on every change under the key `2048_game_state`; on mount the hook rehydrates from storage (with defensive defaults for `undoStack` / `undoCount`) so sessions resume seamlessly.
- **Bounded undo stack.** Each successful move snapshots the prior `{ map, score }` onto an undo stack capped to `MAX_UNDO_COUNT + 1` entries (older snapshots are shifted off), and players may undo at most twice before needing a new move — surfaced live in the UI as `Undo (n/2)`.
- **Keyboard-driven input.** A `keydown` listener (registered/cleaned up via `useEffect`) maps arrow keys to directions, calls `preventDefault` to suppress page scroll, and ignores input once the game is no longer in the `playing` state.
- **Smart game-over detection.** `checkGameOver` first checks for any empty cell, then dry-runs all four directions through the engine — the board is only over when no direction reports `isMoved`.
- **Weighted tile spawning.** New tiles appear in a uniformly random empty cell with the canonical 2048 distribution: **90% chance of a 2, 10% chance of a 4**.
- **Comprehensive test suite.** Jest + React Testing Library cover the engine (directional moves, merges, no-op detection, non-square map validation), the hook (`renderHook` with mocked `gameLogic` and `localStorage` — init, reset, keydown handling, persistence, rehydration), and the `Board` / `Game` / `Tile` / `App` components.
- **CI/CD to AWS.** A GitHub Actions workflow (`deploy-client.yml`) builds the app with Node 20 / Yarn, syncs the production `build/` to S3, and issues a CloudFront cache invalidation on push.

## How It Works

**The board move algorithm.** The board is a 4×4 matrix where each cell holds a tile value or `null`. To process a move, the engine:

1. **Normalizes direction via rotation.** It rotates the matrix counter-clockwise by a direction-specific angle so that the requested move always becomes a leftward move (e.g. an `up` move becomes a `left` move after a 90° rotation).
2. **Collapses each row leftward.** Every row is reduced into a new row: empty cells are squeezed out, and two equal adjacent values merge into their sum (each tile merging only once per pass).
3. **Rotates back.** The collapsed matrix is rotated by the inverse angle to restore the original orientation, returning both the new board and an `isMoved` flag indicating whether anything actually changed.

**Game-state management.** The `use2048Game` hook holds the single source of truth for the game. On each arrow-key press it asks the engine for the next board; if `isMoved` is true it snapshots the previous state for undo, spawns a new random tile, recomputes the score from newly created merged tiles, and re-evaluates status (`win` when a `2048` tile appears, `game-over` when no moves remain, otherwise `playing`). The full state object is mirrored to `localStorage` on every update, so the game is always recoverable.

## Tech Stack

- **React 19** — component-based UI with `useState`, `useEffect`, and `useCallback`
- **JavaScript (ES2020+)** — pure functional game logic, no external state library
- **Create React App (`react-scripts` 5)** — build tooling and dev server
- **Jest + React Testing Library** — unit and component testing
- **GitHub Actions + AWS (S3 + CloudFront)** — automated build and deployment
- **Browser `localStorage`** — client-side game-state persistence

## Getting Started

> Either Yarn or npm works — the deploy pipeline uses Yarn.

```bash
# Install dependencies
yarn install        # or: npm install

# Start the development server
yarn start          # or: npm start

# Run the test suite in watch mode
yarn test           # or: npm test

# Run tests once for CI (no watch, no coverage)
yarn test:ci        # or: npm run test:ci

# Create an optimized production build
yarn build          # or: npm run build
```

### Controls

- **Arrow keys** — slide tiles up / down / left / right
- **새 게임 (New Game)** — reset the board
- **Undo (n/2)** — take back up to two recent moves
