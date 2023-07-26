import { useState, useEffect } from "react";
import {
  BOARD_HEIGHT,
  getRandomBlock,
  hasCollisions,
  useTetrisBoard,
  getEmptyBoard,
} from "./useTetrisBoard";
import { useCallback, useContext } from "react";
import useInterval from "./useInterval";
import {
  Block,
  BlockShape,
  BoardShape,
  EmptyCell,
  SHAPES,
} from "../types/types";
import { MoveContext } from "../pages/GamePage";

enum TickSpeed {
  Normal = 1000,
  Sliding = 100,
  Fast = 10,
}

export function useTetris() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [upComingBlocks, setUpComingBlocks] = useState<Block[]>([]);

  const moveContext = useContext(MoveContext);
  const moveType = moveContext?.moveType;

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    const startingBlocks = [
      getRandomBlock(),
      getRandomBlock(),
      getRandomBlock(),
    ];
    setUpComingBlocks(startingBlocks);
    setScore(0);
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  const commitPosition = useCallback(() => {
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommitting(false);
      setTickSpeed(TickSpeed.Normal);
      return;
    }

    const newBoard = structuredClone(board);
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn,
    );

    let numCleared = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
        numCleared++;
        newBoard.splice(row, 1);
      }
    }

    const newUpcomingBlocks = structuredClone(upComingBlocks);
    const newBlock = newUpcomingBlocks.pop() as Block;
    newUpcomingBlocks.unshift(getRandomBlock());

    // check Game Over
    if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      setIsPlaying(false);
      setTickSpeed(null);
    } else {
      setTickSpeed(TickSpeed.Normal);
    }

    setUpComingBlocks(newUpcomingBlocks);
    setScore((prevScore) => prevScore + getPoints(numCleared));
    dispatchBoardState({
      type: "commit",
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommitting(false);
  }, [
    board,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    upComingBlocks,
  ]);

  const gameTick = useCallback(() => {
    if (isCommitting) {
      commitPosition();
    } else if (
      hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [
    board,
    commitPosition,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isCommitting,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, tickSpeed);
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID: number | undefined;

    const updateMovementInterval = () => {
      dispatchBoardState({
        type: "move",
        isPressingLeft,
        isPressingRight,
      });
    };

    if (moveType === "nothing") {
      isPressingLeft = false;
      isPressingRight = false;
      updateMovementInterval();
      return;
    }
    switch (moveType) {
      case "left":
        isPressingLeft = true;
        isPressingRight = false;
        break;
      case "right":
        isPressingLeft = false;
        isPressingRight = true;
        break;
      case "up":
        isPressingLeft = false;
        isPressingRight = false;
        dispatchBoardState({
          type: "move",
          isRotating: true,
        });
        setTickSpeed(TickSpeed.Normal);
        return;
      case "down":
        isPressingLeft = false;
        isPressingRight = false;
        setTickSpeed(TickSpeed.Fast);
        return;
      default:
        isPressingLeft = false;
        isPressingRight = false;
    }

    updateMovementInterval();
  }, [moveType, dispatchBoardState, isPlaying]);

  // useEffect(() => {
  //   if (!isPlaying) {
  //     return;
  //   }

  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.repeat) {
  //       return;
  //     }

  //     if (event.key === "ArrowDown") {
  //       setTickSpeed(TickSpeed.Fast);
  //     }

  //     if (event.key === "ArrowUp") {
  //       dispatchBoardState({
  //         type: "move",
  //         isRotating: true,
  //       });
  //     }

  //     if (event.key === "ArrowLeft") {
  //       isPressingLeft = true;
  //       updateMovementInterval();
  //     }

  //     if (event.key === "ArrowRight") {
  //       isPressingRight = true;
  //       updateMovementInterval();
  //     }
  //   };

  //   const handleKeyUp = (event: KeyboardEvent) => {
  //     if (event.repeat) {
  //       return;
  //     }

  //     if (event.key === "ArrowUp") {
  //       setTickSpeed(TickSpeed.Normal);
  //     }

  //     if (event.key === "ArrowLeft") {
  //       isPressingLeft = false;
  //       updateMovementInterval();
  //     }

  //     if (event.key === "ArrowRight") {
  //       isPressingRight = false;
  //       updateMovementInterval();
  //     }
  //   };

  //   // document.addEventListener("keydown", handleKeyDown);
  //   // document.addEventListener("keyup", handleKeyUp);
  //   return () => {
  //     // document.removeEventListener("keydown", handleKeyDown);
  //     // document.removeEventListener("keyup", handleKeyUp);
  //     clearInterval(moveIntervalID);
  //     setTickSpeed(TickSpeed.Normal);
  //   };
  // }, [dispatchBoardState, isPlaying]);

  const renderedBoard = structuredClone(board);
  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn,
    );
  }

  return {
    board: renderedBoard,
    startGame,
    isPlaying,
    score,
    upComingBlocks,
  };
}

function getPoints(numCleared: number): number {
  switch (numCleared) {
    case 0:
      return 0;
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 500;
    case 4:
      return 800;
    default:
      throw new Error("Unexpected number of rows cleared");
  }
}

function addShapeToBoard(
  board: BoardShape,
  droppingBlock: Block,
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number,
) {
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          if (board.length > 0) {
            board[droppingRow + rowIndex][droppingColumn + colIndex] =
              droppingBlock;
          }
        }
      });
    });
}
