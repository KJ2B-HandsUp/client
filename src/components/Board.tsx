import { useCallback, useState, useContext } from "react";
import { TableProps } from "../types/table";
import { GridCell, GridTable } from "../styled/tables.styled";
import { GameContext } from "../pages/GamePage";
import { CLICK_BLOCK } from "../types/game.type";

export function Board({ turn, id, row, column }: TableProps) {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const { started, dispatch } = useContext(GameContext);

  const handleCellClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      //console.log(`You clicked cell at row: ${rowIndex + 1}, col: ${colIndex + 1}`);
      setClickedCell({ row: rowIndex, col: colIndex });
      dispatch({
        type: CLICK_BLOCK,
        clickedBlock: { row: rowIndex, column: colIndex },
        userId: id,
      });

      setTimeout(() => {
        setClickedCell(null);
      }, 500); // Reset after 0.5 seconds (500 milliseconds)
    },
    [dispatch, id],
  );

  const renderRow = (rowIndex: number) => {
    return (
      <tr key={rowIndex}>
        {Array.from({ length: row }, (_, colIndex) =>
          renderCell(rowIndex, colIndex),
        )}
      </tr>
    );
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    const isClicked =
      clickedCell?.row === rowIndex && clickedCell?.col === colIndex;

    return (
      <GridCell
        key={colIndex}
        onClick={() => handleCellClick(rowIndex, colIndex)}
        className={isClicked ? "flash" : ""}
      >
        Cell {rowIndex}, {colIndex}
      </GridCell>
    );
  };

  return (
    <>
      {started && turn == id && (
        <GridTable>
          <tbody>
            {Array.from({ length: column }, (_, index) => renderRow(index))}
          </tbody>
        </GridTable>
      )}
    </>
  );
}
