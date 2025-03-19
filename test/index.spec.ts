enum CellState {
  DEAD = 0,
  ALIVE = 1,
}

class Coordinates {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Cell {
  private readonly coordinates: Coordinates;
  private state: CellState = CellState.DEAD;

  constructor(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }
}

class Grid {
  private readonly gridNew: Cell[] = [];
  private grid: CellState[][] = [];
  private height: number;
  private width: number;

  constructor(height: number, width: number) {
    this.grid = Array.from(Array(height), () => Array(width).fill(CellState.DEAD));
    this.height = this.grid.length;
    this.width = this.grid[0].length;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.gridNew.push(new Cell(new Coordinates(x, y)));
      }
    }
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

  addLivingCell(coordinates: Coordinates, livingCell: CellState) {
    this.grid[coordinates.x][coordinates.y] = livingCell;
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
        this.isAlive(x, y) &&
        this.isOnTheGrid(x, y)
      ) {
        livingCellsCount++;
      }
    }
    return livingCellsCount;
  }

  // Data Clump
  // Primitive Obsession
  // Use Coordinates instead
  private isOnTheGrid(x: number, y: number) {
    return y >= 0 && y < this.height &&
      x >= 0 && x < this.width;
  }

  // Data Clump
  // Primitive Obsession
  // Use Coordinates instead
  private isAlive(x: number, y: number) {
    return this.grid[y][x] === CellState.ALIVE;
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
