import { Board } from "./Board";
import { GameContainer, MyCameraView } from "../styled/game.styled";
import { TableProps } from "../types/table";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../types/game.type";
import { memo } from "react";

function OtherUserGame({ turn, id, row, column }: TableProps) {
  console.log("other user game rendered");

  return (
    <GameContainer>
      <MyCameraView>
        <video
          width={CAMERA_VIEW_WIDTH}
          height={CAMERA_VIEW_HEIGHT}
          style={{
            border: "2px solid",
          }}
        />
      </MyCameraView>
      <Board turn={turn} id={id} row={row} column={column} />
    </GameContainer>
  );
}

export default memo(OtherUserGame);
