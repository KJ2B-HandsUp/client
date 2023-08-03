import { useCallback, useState, useContext, useEffect } from "react";
import { TableProps } from "../../types/table";
import { GridCell, GridTable } from "../../styled/tables.styled";
import { SoloGameContext } from "../../pages/sologame/SoloGamePage";
import { CLICK_BLOCK } from "../../types/game.type";
import { colorList, mp3List } from "../../styled/game.styled";

const audioList: HTMLAudioElement[][] = [];
for (let rowIndex = 0; rowIndex < mp3List.length; rowIndex++) {
  const tempList = [];
  for (let colIndex = 0; colIndex < mp3List[0].length; colIndex++) {
    tempList.push(
      new Audio(`/dpmaudio/dubstep_club_${mp3List[rowIndex][colIndex]}.wav`),
    );
  }
  audioList.push([...tempList]);
}

export function SoloGameBoard({ id, row, column }: TableProps) {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const { start, dispatch, trigerClick, clickedBlock } =
    useContext(SoloGameContext);

  const handleCellClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      //console.log(`You clicked cell at row: ${rowIndex + 1}, col: ${colIndex + 1}`);
      const audio = audioList[rowIndex][colIndex];
      audio.pause();
      audio.currentTime = 0;
      audio.play();
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
        flashcolor={colorList[colIndex]}
      />
    );
  };

  return (
    <>
      {start && (
        <GridTable>
          <tbody>
            {Array.from({ length: column }, (_, index) => renderRow(index))}
          </tbody>
        </GridTable>
      )}
    </>
  );
}
