import { useCallback, useState, memo } from "react";
import { GameProps } from "../types/table";
import { GridCell, GridTable } from "../styled/tables.styled";
import { colorList } from "../styled/game.styled";
import { audioList } from "../utils/audio";

function bfs(
  grid: number[][],
  row: number,
  col: number,
  visited: boolean[][],
  setCellFlash: (newFlash: number[][]) => void,
) {
  const rows = 4;
  const cols = 3;
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const queue: number[][] = [];
  const newFlash = [...grid];
  let seconds = 100;
  queue.push([row, col]);
  visited[row][col] = true;

  while (queue.length > 0) {
    const [currentRow, currentCol]: number[] = queue.shift();
    const visitedCell: number[][] = [];
    for (const direction of directions) {
      const newRow = currentRow + direction[0];
      const newCol = currentCol + direction[1];

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol]
      ) {
        queue.push([newRow, newCol]);
        visited[newRow][newCol] = true;
        visitedCell.push([newRow, newCol]);
      }
    }
    setTimeout(() => {
      const newNewFlash = Array.from(
        { length: 4 },
        () => Array(3).fill(0) as number[],
      );
      visitedCell.map((Cell) => {
        newNewFlash[Cell[0]][Cell[1]] = 1;
      });
      setCellFlash(newNewFlash);
    }, seconds);
    seconds += 100;
  }

  setTimeout(() => {
    const newNewFlash = Array.from(
      { length: 4 },
      () => Array(3).fill(0) as number[],
    );
    setCellFlash(newNewFlash);
  }, 600);
}

function SingleBoard({ row, column }: GameProps) {
  const [cellFlash, setCellFlash] = useState(
    Array.from({ length: row }, () => Array(column).fill(0) as number[]),
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

      const visited = Array(4)
        .fill(false)
        .map(() => Array(3).fill(false) as boolean[]);
      bfs(newFlash, rowIndex, colIndex, visited, setCellFlash);
    },
    [cellFlash],
  );

  const renderRow = (rowIndex: number) => (
    <tr key={rowIndex}>
      {Array.from({ length: column }, (_, colIndex) =>
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
              scale: [0.8, 1.2, 0.8, 1],
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
        {Array.from({ length: row }, (_, index) => renderRow(index))}
      </tbody>
    </GridTable>
  );
}

export const MemoizedSingleBoard = memo(SingleBoard);
