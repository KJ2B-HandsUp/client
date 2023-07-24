import { Dispatch, useReducer } from "react";
import {
  Block,
  BoardShape,
  BlockShape,
  SHAPES,
  CellOptions,
  EmptyCell,
} from "../types/types";

export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 20;

export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  droppingShape: BlockShape;
};

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: SHAPES.I.shape,
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(),
      };
      return state;
    },
  );

  return [boardState, dispatchBoardState];
}

export function hasCollisions(
  board: BoardShape,
  currentShape: BlockShape,
  row: number,
  column: number,
): boolean {
  let hasCollision = false;
  currentShape
    .filter((shapeRow) => shapeRow.some((isSet) => isSet))
    .forEach((shapeRow: boolean[], rowIndex: number) => {
      shapeRow.forEach((isSet: boolean, colIndex: number) => {
        if (
          isSet &&
          (row + rowIndex >= board.length ||
            column + colIndex >= board[0].length ||
            column + colIndex < 0 ||
            board[row + rowIndex][column + colIndex] !== EmptyCell.Empty)
        ) {
          hasCollision = true;
        }
      });
    });
  return hasCollision;
}

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty) as CellOptions[]);
}

function rotateBlock(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const columns = shape[0].length;

  const rotated: BlockShape = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => false),
  );

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      rotated[column][rows - 1 - row] = shape[row][column];
    }
  }

  return rotated;
}

export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

type Action = {
  type: "start" | "drop" | "commit" | "move" | "isRotating";
  newBoard?: BoardShape;
  newBlock?: Block;
  isPressingLeft?: boolean;
  isPressingRight?: boolean;
  isRotating?: boolean;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  const newState = { ...state };

  switch (action.type) {
    case "start": {
      const firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    }
    case "drop":
      newState.droppingRow++;
      break;
    case "commit":
      return {
        board: [
          ...getEmptyBoard(BOARD_HEIGHT - action.newBoard!.length),
          ...action.newBoard!,
        ],
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: action.newBlock!,
        droppingShape: SHAPES[action.newBlock!].shape,
      };
    case "move":
      {
        const rotatedShape = action.isRotating
          ? rotateBlock(newState.droppingShape)
          : newState.droppingShape;
        let columnOffset = action.isPressingLeft ? -1 : 0;
        columnOffset = action.isPressingRight ? 1 : columnOffset;
        if (
          !hasCollisions(
            newState.board,
            rotatedShape,
            newState.droppingRow,
            newState.droppingColumn + columnOffset,
          )
        ) {
          newState.droppingColumn += columnOffset;
          newState.droppingShape = rotatedShape;
        }
      }
      break;
    default: {
      const unhandledType = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
    }
  }

  return newState;
}
