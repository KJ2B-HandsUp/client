import { useReducer, useMemo, createContext, useEffect } from "react";
import { MemoizedSingleMyGame } from "../components/SingleMyGame";
import {
  StateType,
  ActionType,
  GameDispatch,
  START_GAME,
  CLICK_BLOCK,
  ROW_LENGTH,
  COL_LENGTH,
} from "../types/game.type";
import {
  CAMERA_VIEW_HEIGHT,
  CAMERA_VIEW_WIDTH,
  GamePageWrapper,
} from "../styled/game.styled";
import { NavLink } from "react-router-dom";
import { TutorialPageWrapper } from "../styled/tutorial.styled";
import { pauseBGMAudio, playBGMAudio } from "../utils/audio";
import HoverCard from "../components/HoverCard";
import CSSButtonComponent from "../components/CSSButtonComponent";
import "/src/index.css";
import SpaceBackground from "../components/SpaceBackground";

const initalState: StateType = {
  start: true,
  end: false,
  playersNum: 1,
  turn: 1,
  endTurn: false,
  blockNum: 0,
  blockList: [],
  prevBlockList: [],
  winner: -1,
  trigerClick: false,
  clickedBlock: { rowIndex: -1, colIndex: -1 },
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case START_GAME:
      console.log("Game Start!");
      return {
        ...state,
        start: true,
        end: false,
        turn: 1,
        endTurn: false,
        blockNum: 0,
        blockList: [],
        prevBlockList: [],
        winner: -1,
      };
    case CLICK_BLOCK:
      return state;
    default:
      return state;
  }
};

export const SingleGameContext = createContext<GameDispatch>({
  start: false,
  dispatch: () => {
    /* default implementation or no-op */
  },
  trigerClick: false,
  clickedBlock: { rowIndex: -1, colIndex: -1 },
});

const myId = 1;

export default function SingleGamePage() {
  const [state, dispatch] = useReducer(reducer, initalState);
  const { turn, start, trigerClick, clickedBlock } = state;
  const value = useMemo(
    () => ({
      start: start,
      dispatch: dispatch,
      trigerClick: trigerClick,
      clickedBlock: clickedBlock,
    }),
    [start, trigerClick, clickedBlock],
  );

  useEffect(() => {
    playBGMAudio();

    return () => {
      pauseBGMAudio();
    };
  });

  return (
    <SpaceBackground>
      <TutorialPageWrapper>
        <GamePageWrapper>
          <SingleGameContext.Provider value={value}>
            <MemoizedSingleMyGame turn={turn} userId={myId} />
          </SingleGameContext.Provider>
          <HoverCard
            header={"게임 방식"}
            style={{
              width: `${CAMERA_VIEW_WIDTH}vw`,
              height: `${CAMERA_VIEW_HEIGHT}vh`,
            }}
          >
            <p style={{ fontSize: "30px" }}>
              검지 손가락을 뒤에서 앞으로
              <br />
              빠르게 꺽는 모션으로
              <br />
              런치패드를 칠 수 있습니다.
            </p>
            <br />

            <br />
            <NavLink to="/main">
              <CSSButtonComponent>Home</CSSButtonComponent>
            </NavLink>
          </HoverCard>
        </GamePageWrapper>
      </TutorialPageWrapper>
    </SpaceBackground>
  );
}
