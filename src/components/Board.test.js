import React from 'react';
import { render } from '@testing-library/react';
import Board from './Board';

describe('Board', () => {
  test('should render empty board', () => {
    const emptyMap = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    
    const { container } = render(<Board map={emptyMap} />);
    const cells = container.querySelectorAll('.board-cell-background');
    
    expect(cells).toHaveLength(16);
  });

  test('should render board with tiles', () => {
    const map = [
      [2, null, null, null],
      [null, 4, null, null],
      [null, null, 8, null],
      [null, null, null, 16],
    ];
    
    const { container } = render(<Board map={map} />);
    const tiles = container.querySelectorAll('.tile');
    
    expect(tiles).toHaveLength(4);
    expect(tiles[0]).toHaveTextContent('2');
    expect(tiles[1]).toHaveTextContent('4');
    expect(tiles[2]).toHaveTextContent('8');
    expect(tiles[3]).toHaveTextContent('16');
  });

  test('should render correct number of cells and tiles', () => {
    const map = [
      [2, 4, null, null],
      [8, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    
    const { container } = render(<Board map={map} />);
    const tiles = container.querySelectorAll('.tile');
    const cells = container.querySelectorAll('.board-cell-background');
    
    expect(tiles).toHaveLength(3);
    expect(cells.length + tiles.length).toBe(16);
  });
});

