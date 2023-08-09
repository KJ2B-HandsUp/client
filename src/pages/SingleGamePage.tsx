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
import { GamePageWrapper } from "../styled/game.styled";
import { NavLink } from "react-router-dom";
import { TutorialPageWrapper } from "../styled/tutorial.styled";
import HomeButton from "../components/HomeButton";

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

  return (
    <TutorialPageWrapper>
      <HomeButton />
      <GamePageWrapper>
        <SingleGameContext.Provider value={value}>
          <MemoizedSingleMyGame
            turn={turn}
            userId={myId}
            row={ROW_LENGTH}
            column={COL_LENGTH}
          />
        </SingleGameContext.Provider>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            color: "black",
            padding: "30px",
            borderRadius: "2%",
          }}
        >
          <h1>가상 런치패드 소개</h1>
          <br />
          <h2>게임 방식</h2>
          <p>화면을 치는 모션으로 런치패드를 칠 수 있습니다.</p>
          <br />

          <br />
          <button>
            <NavLink
              to={`/main`}
              style={{ color: "black", textDecoration: "none" }}
            >
              Home
            </NavLink>
          </button>
        </div>
      </GamePageWrapper>
    </TutorialPageWrapper>
  );
}
