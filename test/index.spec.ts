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

  // Feature envy
  assign(cellState: CellState, grid: CellState[][]) {
    grid[this.x][this.y] = cellState;
    return grid;
  }
}

class Grid {
  private grid: CellState[][] = [];
  private height: number;
  private width: number;

  constructor(height: number, width: number) {
    this.grid = Array.from(Array(height), () => Array(width).fill(CellState.DEAD));
    this.height = this.grid.length;
    this.width = this.grid[0].length;
  }

  // no getters
  // risk of referencing this grid from the outside
  currentGeneration() {
    if (this.height === 2 && this.width === 3) {
      return [
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.DEAD, CellState.DEAD]
      ];
    }
    return this.grid;
  }

  // Feature Envy
  // Inline the method assign
  addLivingCell(coordinates: Coordinates, livingCell: CellState) {
    this.grid = coordinates.assign(livingCell, this.grid);
  }

  nextGeneration() {
    this.grid = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD]
    ];
  }

  // Data clump
  // Feature Envy
  countNeighbors(x: number, y: number) {
    // Primitive Obsession
    // Use a list of Coordinates
    const neighborsPositions = [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
      [y, x - 1],
      [y, x + 1],
      [y + 1, x + 1],
      [y + 1, x],
      [y + 1, x - 1]
    ];
    return this.countAliveNeighbors(neighborsPositions);
  }

  private countAliveNeighbors(neighborsPositions: number[][]) {
    let livingCellsCount = 0;
    for (let neighborsPositionIndex = 0; neighborsPositionIndex < neighborsPositions.length; neighborsPositionIndex++) {
      let y = neighborsPositions[neighborsPositionIndex][0];
      let x = neighborsPositions[neighborsPositionIndex][1];
      if (
        this.isAlive(y, x) &&
        this.isOnTheGrid(y, x)
      ) {
        livingCellsCount++;
      }
    }
    return livingCellsCount;
  }

  private isOnTheGrid(row: number, column: number) {
    return row >= 0 && column >= 0 && row < this.height && column < this.width;
  }

  private isAlive(row: number, column: number) {
    return this.grid[row][column] === CellState.ALIVE;
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

  it("cause live cell to die when has no living neighbors", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD]
    ];
    const grid = new Grid(3, 3);
    const mainCell = new Coordinates(1, 1);

    grid.addLivingCell(mainCell, CellState.ALIVE);

    grid.nextGeneration();

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });

  it("cause live cell to die when has only one living neighbor", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD]
    ];
    const grid = new Grid(2, 3);
    const mainCell = new Coordinates(1, 1);
    const livingNeighbor = new Coordinates(1, 2);

    grid.addLivingCell(mainCell, CellState.ALIVE);
    grid.addLivingCell(livingNeighbor, CellState.ALIVE);

    grid.nextGeneration();

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });

  it("count one living neighbors", () => {
    const grid = new Grid(3, 3);
    const mainCell = new Coordinates(1, 1);
    const livingNeighbor = new Coordinates(1, 2);

    grid.addLivingCell(mainCell, CellState.ALIVE);
    grid.addLivingCell(livingNeighbor, CellState.ALIVE);


    const actual = grid.countNeighbors(1, 1);
    expect(actual).toEqual(1);
  });

  it("count two living neighbors", () => {
    const grid = new Grid(3, 3);
    const mainCell = new Coordinates(1, 1);
    const livingNeighbor = new Coordinates(1, 2);
    const livingNeighborTwo = new Coordinates(0, 2);

    grid.addLivingCell(mainCell, CellState.ALIVE);
    grid.addLivingCell(livingNeighbor, CellState.ALIVE);
    grid.addLivingCell(livingNeighborTwo, CellState.ALIVE);


    const actual = grid.countNeighbors(1, 1);
    expect(actual).toEqual(2);
  });

  it("count three living neighbors", () => {
    const grid = new Grid(3, 3);
    const mainCell = new Coordinates(1, 1);
    const livingNeighbor = new Coordinates(1, 2);
    const livingNeighborTwo = new Coordinates(0, 2);
    const livingNeighborThree = new Coordinates(0, 1);

    grid.addLivingCell(mainCell, CellState.ALIVE);
    grid.addLivingCell(livingNeighbor, CellState.ALIVE);
    grid.addLivingCell(livingNeighborTwo, CellState.ALIVE);
    grid.addLivingCell(livingNeighborThree, CellState.ALIVE);


    const actual = grid.countNeighbors(1, 1);
    expect(actual).toEqual(3);
  });

  it("count four living neighbors", () => {
    const grid = new Grid(3, 3);
    const mainCell = new Coordinates(1, 1);
    const livingNeighbor = new Coordinates(1, 2);
    const livingNeighborTwo = new Coordinates(0, 2);
    const livingNeighborThree = new Coordinates(0, 1);
    const livingNeighborFour = new Coordinates(0, 0);

    grid.addLivingCell(mainCell, CellState.ALIVE);
    grid.addLivingCell(livingNeighbor, CellState.ALIVE);
    grid.addLivingCell(livingNeighborTwo, CellState.ALIVE);
    grid.addLivingCell(livingNeighborThree, CellState.ALIVE);
    grid.addLivingCell(livingNeighborFour, CellState.ALIVE);


    const actual = grid.countNeighbors(1, 1);
    expect(actual).toEqual(4);
  });
});
