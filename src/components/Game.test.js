import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from './Game';

// Mock the hook
jest.mock('../hooks/use2048Game', () => ({
  use2048Game: jest.fn(),
}));

import { use2048Game } from '../hooks/use2048Game';

describe('Game', () => {
  const mockResetGame = jest.fn();
  const mockUndoLastMove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    use2048Game.mockReturnValue({
      map: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      score: 0,
      status: 'playing',
      resetGame: mockResetGame,
      undoLastMove: mockUndoLastMove,
      undoCount: 0,
    });
  });

  test('should render game with title and score', () => {
    render(<Game />);
    
    expect(screen.getByText('2048')).toBeInTheDocument();
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('should render control buttons', () => {
    render(<Game />);
    
    expect(screen.getByText('새 게임')).toBeInTheDocument();
    expect(screen.getByText(/Undo/)).toBeInTheDocument();
  });

  test('should call resetGame when 새 게임 button is clicked', () => {
    render(<Game />);
    
    const resetButton = screen.getByText('새 게임');
    fireEvent.click(resetButton);
    
    expect(mockResetGame).toHaveBeenCalledTimes(1);
  });

  test('should call undoLastMove when Undo button is clicked', () => {
    render(<Game />);
    
    const undoButton = screen.getByText(/Undo/);
    fireEvent.click(undoButton);
    
    expect(mockUndoLastMove).toHaveBeenCalledTimes(1);
  });

  test('should show win message when status is win', () => {
    use2048Game.mockReturnValue({
      map: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      score: 0,
      status: 'win',
      resetGame: mockResetGame,
      undoLastMove: mockUndoLastMove,
      undoCount: 0,
    });

    render(<Game />);
    
    expect(screen.getByText('승리했습니다!')).toBeInTheDocument();
  });

  test('should show game over message when status is game-over', () => {
    use2048Game.mockReturnValue({
      map: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      score: 0,
      status: 'game-over',
      resetGame: mockResetGame,
      undoLastMove: mockUndoLastMove,
      undoCount: 0,
    });

    render(<Game />);
    
    expect(screen.getByText('게임 오버!')).toBeInTheDocument();
  });

  test('should disable undo button when undoCount is 2', () => {
    use2048Game.mockReturnValue({
      map: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      score: 0,
      status: 'playing',
      resetGame: mockResetGame,
      undoLastMove: mockUndoLastMove,
      undoCount: 2,
    });

    render(<Game />);
    
    const undoButton = screen.getByText(/Undo/);
    expect(undoButton).toBeDisabled();
  });
});

