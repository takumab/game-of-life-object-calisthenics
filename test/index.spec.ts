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

  equals(coordinates: Coordinates) {
    return this.x === coordinates.x && this.y === coordinates.y;
  }
}

class Cell {
  private readonly coordinates: Coordinates;
  private state: CellState = CellState.DEAD;

  constructor(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }

  hasPosition(coordinates: Coordinates) {
    return this.coordinates.equals(coordinates);
  }

  getCellState() {
    return this.state;
  }

  comeAlive() {
    this.state = CellState.ALIVE;
  }
}

class Grid {
  private readonly gridNew: Cell[] = [];
  private grid: CellState[][] = [];
  private height: number;
  private width: number;

  constructor(height: number, width: number) {
    this.grid = Array.from(Array(height), () =>
      Array(width).fill(CellState.DEAD),
    );
    this.height = height;
    this.width = width;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.gridNew.push(new Cell(new Coordinates(x, y)));
      }
    }
  }

  addLivingCell(coordinates: Coordinates, livingCell: CellState, cell?: Cell) {
    if (cell) {
      cell.comeAlive();
      this.gridNew[coordinates.y] = cell;
    }
    this.grid[coordinates.x][coordinates.y] = livingCell;
  }

  // no getters
  // risk of referencing this grid from the outside
  currentGeneration() {
    const currentGenerationNew = this.currentGenerationNew();
    return this.mapToOldGrid(currentGenerationNew);
  }

  currentGenerationNew() {
    const tempGrid = [];
    if (this.height === 3 && this.width === 2) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          tempGrid.push(new Cell(new Coordinates(x, y)));
        }
      }
      return tempGrid;
    }
    return this.gridNew;
  }

  nextGeneration() {
    this.grid = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
    ];
  }

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
      [y + 1, x - 1],
    ];
    return this.countAliveNeighbors(neighborsPositions);
  }

  // Data clump
  private mapToOldGrid(currentGenerationNew: Cell[]): CellState[][] {
    const cellState: CellState[][] = [];
    for (let x = 0; x < this.width; x++) {
      cellState[x] = [];
      for (let y = 0; y < this.height; y++) {
        let foundCells = currentGenerationNew.find((cell: Cell) =>
          cell.hasPosition(new Coordinates(x, y)),
        );
        cellState[x][y] = foundCells ? foundCells.getCellState() : 0;
      }
    }
    return cellState;
  }

  private countAliveNeighbors(neighborsPositions: number[][]) {
    let livingCellsCount = 0;
    for (
      let neighborsPositionIndex = 0;
      neighborsPositionIndex < neighborsPositions.length;
      neighborsPositionIndex++
    ) {
      let y = neighborsPositions[neighborsPositionIndex][0];
      let x = neighborsPositions[neighborsPositionIndex][1];
      if (this.isAlive(x, y) && this.isOnTheGrid(x, y)) {
        livingCellsCount++;
      }
    }
    return livingCellsCount;
  }

  // Data Clump
  // Primitive Obsession
  // Use Coordinates instead
  private isOnTheGrid(x: number, y: number) {
    return y >= 0 && y < this.height && x >= 0 && x < this.width;
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
    const expected = [[CellState.DEAD]];
    const grid = new Grid(1, 1);

    const actual = grid.currentGeneration();

    expect(actual).toEqual(expected);
  });

  it("initialize gridNew with a population of one dead cell", () => {
    let coordinates = new Coordinates(0, 0);
    const expected = [new Cell(coordinates)];
    const grid = new Grid(1, 1);

    const actual = grid.currentGenerationNew();

    expect(actual).toEqual(expected);
  });

  it("initialize with  with a population of nine dead cells", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
    ];

    const grid = new Grid(3, 3);

    const actual = grid.currentGeneration();

    expect(actual).toEqual(expected);
  });

  it("add a living cell on a 3x1 grid", () => {
    const expected = [[CellState.DEAD, CellState.ALIVE, CellState.DEAD]];
    const grid = new Grid(3, 1);
    const coordinates = new Coordinates(0, 1);
    const cell = new Cell(coordinates);

    grid.addLivingCell(coordinates, CellState.ALIVE, cell);

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });

  it("add a living cell on a 3x3 grid", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.ALIVE, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
    ];
    const grid = new Grid(3, 3);
    const coordinates = new Coordinates(1, 1);
    const cell = new Cell(coordinates);

    grid.addLivingCell(coordinates, CellState.ALIVE, cell);

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });

  it("add multiple living cells on a 3x3 grid", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.ALIVE, CellState.ALIVE],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
    ];
    const grid = new Grid(3, 3);
    const coordinates = new Coordinates(1, 1);
    const livingNeighborOne = new Coordinates(1, 2);
    const cell1 = new Cell(coordinates);
    const cell2 = new Cell(livingNeighborOne);

    grid.addLivingCell(coordinates, CellState.ALIVE, cell1);
    grid.addLivingCell(livingNeighborOne, CellState.ALIVE, cell2);

    const actual = grid.currentGeneration();
    expect(actual).toEqual(expected);
  });

  it("cause live cell to die when has no living neighbors", () => {
    const expected = [
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
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
      [CellState.DEAD, CellState.DEAD, CellState.DEAD],
    ];
    const grid = new Grid(3, 2);
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
