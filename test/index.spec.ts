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

  live(cellState: CellState) {
    this.state = cellState;
  }
}

class Grid {
  private readonly gridNew: Cell[] = [];
  private gridHashMap: Map<number, Cell> = new Map([]);
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

  addLivingCell(coordinates: Coordinates, livingCell: CellState) {
    const foundCell = this.findCellAt(coordinates);
    foundCell?.live(livingCell);
    this.grid[coordinates.x][coordinates.y] = livingCell;
  }

  currentGeneration() {
    return this.gridNew;
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

  private findCellAt(coordinates: Coordinates) {
    return this.gridNew.find((cell: Cell) => cell.hasPosition(coordinates));
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
  describe("Initilize population", () => {
    it("initialize gridNew with a population of one dead cell", () => {
      let coordinates = new Coordinates(0, 0);
      const expected = [new Cell(coordinates)];
      const grid = new Grid(1, 1);

      const actual = grid.currentGeneration();

      expect(actual).toEqual(expected);
    });

    it("initialize Grid with a population of nine dead cells", () => {
      const expected = [
        new Cell(new Coordinates(0, 0)),
        new Cell(new Coordinates(1, 0)),
        new Cell(new Coordinates(2, 0)),
        new Cell(new Coordinates(0, 1)),
        new Cell(new Coordinates(1, 1)),
        new Cell(new Coordinates(2, 1)),
        new Cell(new Coordinates(0, 2)),
        new Cell(new Coordinates(1, 2)),
        new Cell(new Coordinates(2, 2)),
      ];

      const grid = new Grid(3, 3);

      const actual = grid.currentGeneration();

      expect(actual).toEqual(expected);
    });
  });

  describe("Add living cell", () => {
    it("add a living cell at coordinate 0:1", () => {
      const grid = new Grid(3, 1);
      const coordinates = new Coordinates(0, 1);
      const cell = new Cell(coordinates);
      cell.live(CellState.ALIVE);

      const expected = [
        new Cell(new Coordinates(0, 0)),
        cell,
        new Cell(new Coordinates(0, 2)),
      ];
      grid.addLivingCell(coordinates, CellState.ALIVE);

      const actual = grid.currentGeneration();
      expect(actual).toEqual(expected);
    });

    it("add a living cell at coordinate 1:1", () => {
      const cell = new Cell(new Coordinates(2, 1));
      cell.live(CellState.ALIVE);
      const expected = [
        new Cell(new Coordinates(0, 0)),
        new Cell(new Coordinates(1, 0)),
        new Cell(new Coordinates(2, 0)),
        new Cell(new Coordinates(0, 1)),
        new Cell(new Coordinates(1, 1)),
        cell,
        new Cell(new Coordinates(0, 2)),
        new Cell(new Coordinates(1, 2)),
        new Cell(new Coordinates(2, 2)),
      ];

      const grid = new Grid(3, 3);
      const coordinates = new Coordinates(2, 1);

      grid.addLivingCell(coordinates, CellState.ALIVE);

      const actual = grid.currentGeneration();
      expect(actual).toEqual(expected);
    });

    it("add multiple living cells at coordinates 1:1 and 1:2", () => {
      const grid = new Grid(3, 3);
      const coordinates = new Coordinates(1, 1);
      const neighborCoordinates = new Coordinates(1, 2);
      const cell = new Cell(coordinates);
      const neighbor = new Cell(neighborCoordinates);
      cell.live(CellState.ALIVE);
      neighbor.live(CellState.ALIVE);

      const expected = [
        new Cell(new Coordinates(0, 0)),
        new Cell(new Coordinates(1, 0)),
        new Cell(new Coordinates(2, 0)),
        new Cell(new Coordinates(0, 1)),
        cell,
        new Cell(new Coordinates(2, 1)),
        new Cell(new Coordinates(0, 2)),
        neighbor,
        new Cell(new Coordinates(2, 2)),
      ];

      grid.addLivingCell(coordinates, CellState.ALIVE);
      grid.addLivingCell(neighborCoordinates, CellState.ALIVE);

      const actual = grid.currentGeneration();
      expect(actual).toEqual(expected);
    });
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
