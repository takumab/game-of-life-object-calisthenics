enum CellState {
  DEAD = 0,
  ALIVE = 1,
}

type Columns = number;
type Rows = number;


class Grid {
  private rows: Rows;
  private columns: Columns;
  private grid: CellState[][] = [];

  constructor(rows: Rows, columns: Columns) {
    this.rows = rows;
    this.columns = columns;
    this.grid = Array.from(Array(rows), () => Array(columns).fill(CellState.DEAD));
  }

  currentGeneration() {
    return this.grid;
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

  it("initialize with  with a population of nine dead cells", () => {
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
