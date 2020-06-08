import dotenv from 'dotenv';
dotenv.config();

interface IGameEngine {
  createGame(): any;
  progressGame(color: string): any;
  solveGame(): any;
}

class GameEngine implements IGameEngine {
  colors: string[];
  grid: number[][];
  visited: boolean[][];
  size: number;
  solvedTurns: number;
  playerTurns: number;
  stepsSolution: string[];
  result: number[];
  stepsArray: string[][][];
  computeOneStep: string[][];
  constructor(
    gridSize?: number | undefined,
    playerTurns?: number,
    grid?: number[][],
    visited?: boolean[][],
    solvedTurns?: number
  ) {
    this.colors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];
    this.grid = grid ? grid : [];
    this.visited = visited ? visited : [];
    this.solvedTurns = solvedTurns ? solvedTurns : 0;
    this.size = gridSize
      ? gridSize
      : parseInt(process.env.defaultGridSize as string);
    this.result = [];
    this.stepsArray = [];
    this.playerTurns = playerTurns ? playerTurns : 0;
    this.stepsSolution = [];
    this.computeOneStep = [];
  }
  /**
   * @function createGame Function Created New Game With Specific Size.
   * @name grid Color Cells
   * @name visited Visited Cells
   * Looping To Initialize Randomize Colors And Un Visited Cells
   * Solve Game To Calculate Number Of Turns
   * @return { Board Size, Board, Player Turns, Max Number Of Turns, Visited Cells }
   */
  createGame() {
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      this.visited[i] = [];
      for (let j = 0; j < this.size; j++) {
        let rand = Math.floor(Math.random() * this.colors.length);
        this.grid[i][j] = rand;
      }
    }
    const original = this._deepClone(this.grid);
    this.solveGame();
    return {
      size: this.size,
      grid: original,
      playerTurns: 0,
      solvedTurns: this.solvedTurns,
      visited: this.visited,
    };
  }

  /**
   * @function progressGame Function To Flood With Specific Color
   * @param {color} Color Cells
   * @name colorNumber Converted Color To Number
   * Start Flooding With Given Color
   *
   * @return { Board Size, Board, Player Turns, Max Number Of Turns, Visited Cells, Chosen Color For History,}
   */
  progressGame(color: string) {
    const colorNumber = this.colors.findIndex((element) => element === color);
    this._floodWithNewColor(colorNumber);
    const copiedResult = this._deepClone(this.grid);
    this.pushOneStep(copiedResult);
    return {
      size: this.size,
      grid: this.convertToNumber(this.computeOneStep),
      playerTurns: this.playerTurns + 1,
      solvedTurns: this.solvedTurns,
      visited: this.visited,
      playerChosenColor: color,
      nextGrid: this.computeOneStep,
    };
  }

  /**
   * @function solveGame Function To Flood With Specific Color
   * @name color Color Cells
   * @name colorNumber Converted Color To Number
   * Start Flooding With Given Color
   *
   * @return { Board Size, Board, Player Turns, Max Number Of Turns, Visited Cells, Chosen Color For History,}
   */
  solveGame() {
    const copiedResult = this._deepClone(this.grid);
    this.pushStepsToArray(copiedResult);
    if (this._floodTillMax()) {
    } else {
      this.solveGame();
    }
    return {
      takenTurns: this.solvedTurns,
      takenColors: this.stepsSolution,
    };
  }

  /**
   * @function _deepClone Function To Copy Array Without Changing
   * @name array 2D Array Refers To Board
   *
   * @return { 2D Array}
   */
  private _deepClone<T>(array: T[][]): T[][] {
    return array.map(function (arr) {
      return arr.slice();
    });
  }

  /**
   * @function pushStepsToArray Saving Computer Solving Boards History
   * @name grid 2D Array Refers To Board
   * @global stepsArray 3D Array Contains Array Of Solved Boards Color By Color
   */
  private pushStepsToArray(grid: number[][]) {
    const result = this.convertToColor(grid);
    this.stepsArray.push(result);
  }

  /**
   * @function convertToColor Convert Color From Number To String
   * @name grid 2D Array Refers To Board
   * @return { 2D Colored Board}
   */
  convertToColor(grid: number[][]) {
    const result = grid.map((arrayOfNumbers) =>
      arrayOfNumbers.map((number) => this.colors[number])
    );
    return result;
  }

  /**
   * @function convertToNumber Convert Color From String To Number
   * @name grid 2D Array Refers To Board
   * @return { 2D Numbers Board}
   */
  convertToNumber(grid: string[][]) {
    const result = grid.map((arrayOfStrings) =>
      arrayOfStrings.map((string) =>
        this.colors.findIndex((value) => value === string)
      )
    );
    return result;
  }

  /**
   * @function pushOneStep Save One Step Board
   * @name grid 2D Array Refers To Board
   * @global computeOneStep => Saving The Board On It
   */
  private pushOneStep(grid: number[][]) {
    const result = this.convertToColor(grid);
    this.computeOneStep = result;
  }

  /**
   * @function _clearVisitedCells Clear Visited Cells On Board
   * @global visited => 2D Array Of Booleans Refers To Visited Cells
   * @return { 2D Array Of Unvisited Cells}
   */
  private _clearVisitedCells() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.visited[i][j] = false;
      }
    }
  }

  /**
   * @function _countConnected Count Number Of Cells By Flooding That Has Specific Color
   * @global visited => 2D Array Of Booleans Refers To Visited Cells To UnCount Visited Cells Again
   * -----------
   * |1|1|0|1|1|
   * -----------
   * |1|1|1|0|0|
   * -----------
   * For Color 1 Return 5 Cells By Flooding Start From Original
   * @return { Number Of Connected Cells Of Specific Color}
   */
  private _countConnected(i: number, j: number, c: number): number {
    if (
      i < 0 ||
      j < 0 ||
      i >= this.size ||
      j >= this.size ||
      this.visited[i][j] ||
      this.grid[i][j] !== c
    ) {
      return 0;
    }
    this.visited[i][j] = true;
    return (
      this._countConnected(i, j - 1, c) +
      this._countConnected(i, j + 1, c) +
      this._countConnected(i - 1, j, c) +
      this._countConnected(i + 1, j, c) +
      1
    );
  }

  /**
   * @function _flood Apply Flooding With Specific Color Recursively To Most Cells Number
   * @global visited => 2D Array Of Visited Cells
   * @global grid => 2D Array Of Board
   * @name _flood => Recursive Function For Start Flooding Right / Left / Bottom / Top  *
   */
  private _flood(i: number, j: number, Start: number, replace: number): number {
    if (
      i < 0 ||
      j < 0 ||
      i >= this.size ||
      j >= this.size ||
      this.visited[i][j]
    ) {
      return 0;
    }
    this.visited[i][j] = true;
    if (this.grid[i][j] === Start) {
      this.grid[i][j] = replace;
      return (
        1 +
        this._flood(i, j + 1, Start, replace) +
        this._flood(i, j - 1, Start, replace) +
        this._flood(i + 1, j, Start, replace) +
        this._flood(i - 1, j, Start, replace)
      );
    } else if (this.grid[i][j] === replace) {
      this.visited[i][j] = false;
      return this._countConnected(i, j, replace);
    }
    return 0;
  }

  /**
   * @function _floodWithNewColor Apply Flooding With Specific Color
   * @global _clearVisitedCells => This Function For Clear Visited Cells
   * @name _flood => Recursive Function For Start Flooding   *
   */
  private _floodWithNewColor(c: number): boolean {
    if (this.grid[0][0] === c) {
      return false;
    }
    this._clearVisitedCells();
    // Check if number of cells flooded is equal to of grid.
    const countFlooded = this._flood(0, 0, this.grid[0][0], c);
    const checkSolved = countFlooded === this.size * this.size;
    this.solvedTurns = this.solvedTurns + 1;
    return checkSolved;
  }

  /**
   * @function _checkConnected Recursive For Increment The Number Of Connected Colors
   * @global result => This Array Of Counted Connected Colors
   * @name _checkConnected => Recursive On Right And Down Cells Cause Its Recursive Only On (0,0)   *
   */
  private _checkConnected(i: number, j: number) {
    if (
      i < 0 ||
      j < 0 ||
      i >= this.size ||
      j >= this.size ||
      this.visited[i][j]
    ) {
      return;
    }
    //Exception
    if (this.grid[i][j] === this.grid[0][0]) {
      this.visited[i][j] = true;
      this._checkConnected(i, j + 1);
      this._checkConnected(i + 1, j);
    } else {
      this.result[this.grid[i][j]] += this._countConnected(
        i,
        j,
        this.grid[i][j]
      );
    }
  }

  /**
   * @function _checkNeighbors Check Best Neighbor Color To Choose It
   * @global result => This Array Of Counted Connected Colors
   * @global stepsSolution => Save The Best Color In Array
   * @return {  Color Of Max. Number of Connected Cells Of Same Color   }
   */
  private _checkNeighbors() {
    this._clearVisitedCells();
    for (let i = 0; i < this.size; i++) {
      this.result[i] = 0;
    }
    this._checkConnected(0, 0);
    let max = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.result[i] > this.result[max]) {
        max = i;
      }
    }
    this.stepsSolution.push(this.colors[max]);
    return max;
  }

  /**
   * @function _floodTillMax Clear Visited Cells On Board
   * @global visited => 2D Array Of Booleans Refers To Visited Cells
   * @return { 2D Array Of Unvisited Cells}
   */
  private _floodTillMax() {
    const color = this._checkNeighbors();
    return this._floodWithNewColor(color);
  }
}

export default GameEngine;
