import React from 'react';
import { render } from '@testing-library/react';
import Tile from './Tile';

describe('Tile', () => {
  test('should render tile with value', () => {
    const { container } = render(<Tile value={2} />);
    const tile = container.querySelector('.tile');
    
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveTextContent('2');
    expect(tile).toHaveClass('tile', 'tile-2');
  });

  test('should render tile with different values', () => {
    const { container, rerender } = render(<Tile value={4} />);
    let tile = container.querySelector('.tile');
    
    expect(tile).toHaveTextContent('4');
    expect(tile).toHaveClass('tile-4');

    rerender(<Tile value={2048} />);
    tile = container.querySelector('.tile');
    expect(tile).toHaveTextContent('2048');
    expect(tile).toHaveClass('tile-2048');
  });
});

