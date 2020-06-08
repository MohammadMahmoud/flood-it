import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import './layout.css';

const Layout = () => {
  const [gameId, setGameId] = useState<string>();

  const [lastChosenColor, setLastChosenColor] = useState<string>();

  const [disableSolveButton, setDisableSolveButton] = useState<boolean>();

  const [disableGrid, setDisableGrid] = useState<boolean>(false);

  const [disableNewGameButton, setDisableNewGameButton] = useState<boolean>();

  const [grid, setGrid] = useState<string[][]>();

  const [playerMoves, setPlayerMoves] = useState<string[]>([]);

  const [computerMoves, setComputerMoves] = useState<string[]>([]);

  const [solvedTurns, setSolvedTurns] = useState<number>(0);

  const [playerTurns, setPlayerTurns] = useState<number>(0);

  useEffect(() => {
    fetch('/api/game/')
      .then((response) => response.json())
      .then((data) => {
        setGameId(data.message.gameId);
        setGrid(data.message.grid);
        setSolvedTurns(data.message.solvedTurns);
      });
  }, []);

  const handleNewGame = () => {
    if (window.confirm('Current progress will be gone, Are you sure?'))
      fetch('/api/game/')
        .then((response) => response.json())
        .then((data) => {
          setPlayerMoves([]);
          setComputerMoves([]);
          setGameId(data.message.gameId);
          setGrid(data.message.grid);
          setSolvedTurns(data.message.solvedTurns);
          setDisableSolveButton(false);
          setDisableGrid(false);
          setPlayerTurns(data.message.playerTurns);
        });
  };

  const handleSolveGame = () => {
    if (window.confirm('Current progress will be gone, Are you sure?'))
      fetch(`/api/game/${gameId}/solve`)
        .then((response) => response.json())
        .then((data) => {
          let count = 0;
          setComputerMoves(data.message.takenColors);
          let computerSolveSteps = setInterval(function () {
            if (count === data.message.takenColors.length - 1) {
              setDisableNewGameButton(false);
              setDisableGrid(true);
              clearInterval(computerSolveSteps);
            }
            handleChooseColor(data.message.takenColors[count]);
            count++;
          }, 1000);
          setDisableSolveButton(true);
          setDisableNewGameButton(true);
        });
  };

  const handleChooseColor = (color: string, player?: boolean) => {
    if (player) {
      setPlayerMoves([...playerMoves, color]);
    }
    setLastChosenColor(color);
    if (color === lastChosenColor) {
      return false;
    }
    if (playerTurns >= solvedTurns) {
      window.alert(
        'You have beaten by computer :( , how about start new one? ;)'
      );
      setDisableSolveButton(true);
      return false;
    }
    if (disableGrid === false) {
      fetch(`/api/game/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color }),
      })
        .then((response) => response.json())
        .then((data) => {
          setGrid(data.message.nextGrid);
          setPlayerTurns(data.message.playerTurns);
        });
    } else {
      window.confirm(
        'You already solved the game, how about start new one? ;)'
      );
    }
  };

  return (
    <div className='container'>
      <div className='user-history'>
        <h2>Your Moves</h2>
        <table>
          <tbody>
            <tr>
              {playerMoves.map((element: string, key: number) => (
                <td
                  key={key}
                  className='historyRow'
                  style={{
                    backgroundColor: element,
                  }}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className='computer-history'>
        <h2>Computer Moves</h2>
        <table>
          <tbody>
            <tr>
              {computerMoves.map((element: string, key: number) => (
                <td
                  key={key}
                  className='historyRow'
                  style={{
                    backgroundColor: element,
                  }}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Click on the cell to pick color</h2>
      Your Turns {playerTurns} / Computer Best Turns {solvedTurns}
      {grid ? (
        <>
          <table className='table'>
            <tbody>
              {grid.map((array: string[], key: number) => (
                <tr key={key}>
                  {array.map((color: string, key: number) => (
                    <td
                      key={key}
                      className='row'
                      style={{ backgroundColor: color }}
                      onClick={() => handleChooseColor(color, true)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant='contained'
            color='default'
            disabled={disableNewGameButton}
            onClick={handleNewGame}
          >
            New Game
          </Button>
          <Button
            disabled={disableSolveButton}
            variant='contained'
            color='default'
            onClick={handleSolveGame}
          >
            Solve the game
          </Button>
        </>
      ) : (
        <> Game Loading.. </>
      )}
    </div>
  );
};

export default Layout;
