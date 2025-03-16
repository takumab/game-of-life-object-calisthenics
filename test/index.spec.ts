enum CellState {
  DEAD = 0,
  ALIVE = 1,
}

type Columns = number;
type Rows = number;



class Grid {
  private rows: Rows;
  private columns: Columns;
  constructor(rows: Rows, columns: Columns) {
    this.rows = rows;
    this.columns = columns;
  }

  nextGeneration() {
    return [[CellState.DEAD]];
  }
}

describe('GameOfLife', () => {
    it('should cause any live cell to die when it has no neighbors', () => {
      const expected = [
        [CellState.DEAD]
      ];
      const grid = new Grid(1,1);

      const actual = grid.nextGeneration();

      expect(actual).toEqual(expected)
    });
});
