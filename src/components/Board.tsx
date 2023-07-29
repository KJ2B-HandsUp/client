import { useCallback, useState } from "react";
import "./TableComponent.css";

interface TableProps {
  row: number;
  column: number;
}

export function Board({ row, column }: TableProps) {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
    console.log(
      `You clicked cell at row: ${rowIndex + 1}, col: ${colIndex + 1}`,
    );
    setClickedCell({ row: rowIndex, col: colIndex });

    setTimeout(() => {
      setClickedCell(null);
    }, 500); // Reset after 0.5 seconds (500 milliseconds)
  }, []);

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
      <td
        key={colIndex}
        onClick={() => handleCellClick(rowIndex, colIndex)}
        className={isClicked ? "flash" : ""}
      >
        Cell {rowIndex + 1}, {colIndex + 1}
      </td>
    );
  };

  return (
    <table className="gridTable">
      <tbody>
        {Array.from({ length: column }, (_, index) => renderRow(index))}
      </tbody>
    </table>
  );
}
