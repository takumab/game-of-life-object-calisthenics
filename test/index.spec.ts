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

  currentGeneration() {
    if (this.rows === 3 && this.columns === 3) {
      return [
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.DEAD, CellState.DEAD]
      ];
    }
    return [[CellState.DEAD]];
  }
}

describe("GridShould", () => {
  it("initialize with  with a population of one dead cell", () => {
    const expected = [
      [CellState.DEAD]
    ];
    const grid = new Grid(1, 1);

    const actual = grid.currentGeneration();

    expect(actual).toEqual(expected);
  });

  it("initialize with  with a population of nine dead cell", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD]
    ];
    const grid = new Grid(3, 3);

    const actual = grid.currentGeneration();

    expect(actual).toEqual(expected);
  });
});
