import { moveMapIn2048Rule } from './index';

describe('moveMapIn2048Rule', () => {
  test('should throw error for invalid map', () => {
    const invalidMap = [[1, 2], [1, 2, 3]];
    expect(() => moveMapIn2048Rule(invalidMap, 'left')).toThrow('Map is not N by M');
  });

  test('should move left correctly', () => {
    const map = [
      [2, null, 2, null],
      [null, 2, 2, null],
      [4, 4, null, null],
      [2, 2, 2, 2],
    ];
    const { result, isMoved } = moveMapIn2048Rule(map, 'left');
    
    expect(result[0]).toEqual([4, null, null, null]);
    expect(result[1]).toEqual([4, null, null, null]);
    expect(result[2]).toEqual([8, null, null, null]);
    expect(result[3]).toEqual([4, 4, null, null]);
    expect(isMoved).toBe(true);
  });

  test('should move right correctly', () => {
    const map = [
      [2, null, 2, null],
      [null, null, null, null],
      [4, null, null, null],
      [null, null, null, null],
    ];
    const { result, isMoved } = moveMapIn2048Rule(map, 'right');
    
    expect(result[0]).toEqual([null, null, null, 4]);
    expect(isMoved).toBe(true);
  });

  test('should move up correctly', () => {
    const map = [
      [2, null, null, null],
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { result, isMoved } = moveMapIn2048Rule(map, 'up');
    
    expect(result[0]).toEqual([4, null, null, null]);
    expect(result[1]).toEqual([null, null, null, null]);
    expect(result[2]).toEqual([null, null, null, null]);
    expect(result[3]).toEqual([null, null, null, null]);
    expect(isMoved).toBe(true);
  });

  test('should move down correctly', () => {
    const map = [
      [2, null, null, null],
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { result, isMoved } = moveMapIn2048Rule(map, 'down');
    
    expect(result[0]).toEqual([null, null, null, null]);
    expect(result[1]).toEqual([null, null, null, null]);
    expect(result[2]).toEqual([null, null, null, null]);
    expect(result[3]).toEqual([4, null, null, null]);
    expect(isMoved).toBe(true);
  });

  test('should not move when no tiles can move', () => {
    const map = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ];
    const { result, isMoved } = moveMapIn2048Rule(map, 'left');
    
    expect(result).toEqual(map);
    expect(isMoved).toBe(false);
  });

  test('should handle empty map', () => {
    const map = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { result, isMoved } = moveMapIn2048Rule(map, 'left');
    
    expect(result).toEqual(map);
    expect(isMoved).toBe(false);
  });

  test('should merge tiles correctly', () => {
    const map = [
      [2, 2, 4, 4],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { result, isMoved } = moveMapIn2048Rule(map, 'left');
    
    expect(result[0]).toEqual([4, 8, null, null]);
    expect(isMoved).toBe(true);
  });
});

