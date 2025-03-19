enum CellState {
  DEAD = 0,
  ALIVE = 1,
}

type Columns = number;
type Rows = number;


class Coordinates {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  place(livingCell: CellState, grid: CellState[][]) {
    grid[this.x][this.y] = livingCell;
    return grid;
  }
}

class Grid {
  private grid: CellState[][] = [];

  constructor(rows: Rows, columns: Columns) {
    this.grid = Array.from(Array(rows), () => Array(columns).fill(CellState.DEAD));
  }

  currentGeneration() {
    return this.grid;
  }

  addLivingCell(coordinates: Coordinates, livingCell: CellState) {
    this.grid = coordinates.place(livingCell, this.grid);
  }
}

describe("GridShould", () => {
  it("initialize with a population of one dead cell", () => {
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

  it("add a living cell on a 1x1 grid", () => {
    const expected = [
      [CellState.DEAD, CellState.ALIVE, CellState.DEAD]
    ];
    const grid = new Grid(1, 3);
    const coordinates = new Coordinates(0, 1);

    grid.addLivingCell(coordinates, CellState.ALIVE);

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });

  it("add a living cell on a 3x3 grid", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.ALIVE, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD]
    ];
    const grid = new Grid(3, 3);
    const coordinates = new Coordinates(1, 1);

    grid.addLivingCell(coordinates, CellState.ALIVE);

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });

  it("add multiple living cells on a 3x3 grid", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.ALIVE],
      [CellState.DEAD, CellState.ALIVE, CellState.ALIVE],
      [CellState.DEAD, CellState.DEAD, CellState.ALIVE]
    ];
    const grid = new Grid(3, 3);
    const mainCell = new Coordinates(1, 1);
    const livingNeighborOne = new Coordinates(0, 2);
    const livingNeighborTwo = new Coordinates(1, 2);
    const livingNeighborThree = new Coordinates(2, 2);

    grid.addLivingCell(mainCell, CellState.ALIVE);
    grid.addLivingCell(livingNeighborOne, CellState.ALIVE);
    grid.addLivingCell(livingNeighborTwo, CellState.ALIVE);
    grid.addLivingCell(livingNeighborThree, CellState.ALIVE);

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });
});
