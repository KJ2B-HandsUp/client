import { useCallback, useState, memo } from "react";
import { GameProps } from "../types/table";
import { GridCell, GridTable } from "../styled/tables.styled";
import { colorList } from "../styled/game.styled";
import { audioList } from "../utils/audio";
import { COL_LENGTH, ROW_LENGTH } from "../types/game.type";

function bfs(
  row: number,
  col: number,
  visited: boolean[][],
  setCellFlash: (newFlash: number[][]) => void,
) {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const queue: number[][] = [];
  let seconds = 60;
  queue.push([row, col]);
  visited[row][col] = true;

  while (queue.length > 0) {
    const [currentRow, currentCol]: number[] = queue.shift()!;
    const visitedCell: number[][] = [];
    for (const direction of directions) {
      const newRow = currentRow + direction[0];
      const newCol = currentCol + direction[1];

      if (
        newRow >= 0 &&
        newRow < ROW_LENGTH &&
        newCol >= 0 &&
        newCol < COL_LENGTH &&
        !visited[newRow][newCol]
      ) {
        queue.push([newRow, newCol]);
        visited[newRow][newCol] = true;
        visitedCell.push([newRow, newCol]);
      }
    }
    setTimeout(() => {
      const newNewFlash = Array.from(
        { length: ROW_LENGTH },
        () => Array(COL_LENGTH).fill(0) as number[],
      );
      visitedCell.map((Cell) => {
        newNewFlash[Cell[0]][Cell[1]] = 1;
      });
      setCellFlash(newNewFlash);
    }, seconds);
    seconds += 60;
  }

  setTimeout(() => {
    const newNewFlash = Array.from(
      { length: ROW_LENGTH },
      () => Array(COL_LENGTH).fill(0) as number[],
    );
    setCellFlash(newNewFlash);
  }, 400);
}

function SingleBoard({}: GameProps) {
  const [cellFlash, setCellFlash] = useState(
    Array.from(
      { length: ROW_LENGTH },
      () => Array(COL_LENGTH).fill(0) as number[],
    ),
  );

  const handleCellClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      // 클릭한 셀의 애니메이션 상태를 true로 설정
      const newFlash = [...cellFlash];
      newFlash[rowIndex][colIndex] = 2;
      setCellFlash([...newFlash]);

      const audio = audioList[rowIndex][colIndex];
      audio.currentTime = 0;
      audio.play();

      const visited = Array(ROW_LENGTH)
        .fill(false)
        .map(() => Array(COL_LENGTH).fill(false) as boolean[]);
      bfs(rowIndex, colIndex, visited, setCellFlash);
    },
    [cellFlash],
  );

  const renderRow = (rowIndex: number) => (
    <tr key={rowIndex}>
      {Array.from({ length: COL_LENGTH }, (_, colIndex) =>
        renderCell(rowIndex, colIndex),
      )}
    </tr>
  );

  const renderCell = (rowIndex: number, colIndex: number) => (
    <GridCell
      key={colIndex}
      flashcolor={colorList[colIndex]}
      initial={{
        scale: 1,
      }}
      animate={
        cellFlash[rowIndex][colIndex] >= 1
          ? {
              scale: [0.9, 1.1, 0.9, 1],
            }
          : {}
      }
      transition={{ type: "spring", stiffness: 150, duration: 1 }}
      className={cellFlash[rowIndex][colIndex] === 2 ? "flash" : ""}
      onClick={() => handleCellClick(rowIndex, colIndex)}
    />
  );

  return (
    <GridTable>
      <tbody>
        {Array.from({ length: ROW_LENGTH }, (_, index) => renderRow(index))}
      </tbody>
    </GridTable>
  );
}

export const MemoizedSingleBoard = memo(SingleBoard);
