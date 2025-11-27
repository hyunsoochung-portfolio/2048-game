import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Game component
jest.mock('./components/Game', () => {
  return function MockGame() {
    return <div data-testid="game-component">Game Component</div>;
  };
});

describe('App', () => {
  test('should render App component', () => {
    render(<App />);
    expect(screen.getByTestId('game-component')).toBeInTheDocument();
  });
});

