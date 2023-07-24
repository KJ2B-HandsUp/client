import { CellOptions } from "./types";
import Cell from "./Cell";
import { styled } from "styled-components";

interface Props {
  currentBoard: CellOptions[][];
}

const BoardWrapper = styled.div`
  border: 2px solid black;
  box-sizing: border-box;
`;

function Board({ currentBoard }: Props) {
  return (
    <BoardWrapper>
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </BoardWrapper>
  );
}

export default Board;
