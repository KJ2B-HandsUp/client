import { useCallback, useState, useContext, useEffect } from "react";
import { TableProps } from "../types/table";
import { GridCell, GridTable } from "../styled/tables.styled";
import { GameContext } from "../pages/GamePage";
import { CLICK_BLOCK } from "../types/game.type";

export function Board({ id, row, column }: TableProps) {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const { started, dispatch, trigerClick, clickedBlock } =
    useContext(GameContext);
  //console.log("board is is: ", id);

  const handleCellClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      //console.log(`You clicked cell at row: ${rowIndex + 1}, col: ${colIndex + 1}`);
      setClickedCell({ row: rowIndex, col: colIndex });
      dispatch({
        type: CLICK_BLOCK,
        userId: id,
        clickedBlock: { rowIndex: rowIndex, colIndex: colIndex },
      });

      setTimeout(() => {
        setClickedCell(null);
      }, 500); // Reset after 0.5 seconds (500 milliseconds)
    },
    [dispatch, id],
  );

  useEffect(() => {
    if (trigerClick) {
      handleCellClick(clickedBlock.rowIndex, clickedBlock.colIndex);
    }
  }, [handleCellClick, trigerClick]);

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
      {started && (
        <GridTable>
          <tbody>
            {Array.from({ length: column }, (_, index) => renderRow(index))}
          </tbody>
        </GridTable>
      )}
    </>
  );
}
