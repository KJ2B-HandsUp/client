import { useCallback, useState, memo } from "react";
import { GameProps } from "../types/table";
import { GridCell, GridTable } from "../styled/tables.styled";
import { colorList } from "../styled/game.styled";
import { audioList } from "../utils/audio";

function SingleBoard({ row, column }: GameProps) {
  const [cellFlash, setCellFlash] = useState(
    Array.from({ length: row }, () => Array(column).fill(false) as boolean[]),
  );

  const handleCellClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      // 클릭한 셀의 애니메이션 상태를 true로 설정
      const newCellFlash = cellFlash.map((row, i) =>
        i === rowIndex
          ? ([
              ...row.slice(0, colIndex),
              true,
              ...row.slice(colIndex + 1),
            ] as boolean[])
          : row,
      );
      setCellFlash(newCellFlash);

      const audio = audioList[rowIndex][colIndex];
      audio.currentTime = 0;
      audio.play();

      // 0.5초 후에 애니메이션 상태를 초기화
      setTimeout(() => {
        newCellFlash[rowIndex][colIndex] = false;
        setCellFlash([...newCellFlash]);
      }, 100);
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
      onClick={() => handleCellClick(rowIndex, colIndex)}
      className={cellFlash[rowIndex][colIndex] ? "flash" : ""}
      flashcolor={colorList[colIndex]}
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
