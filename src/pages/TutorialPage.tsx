import { TutorialPageWrapper } from "../styled/tutorial.styled";
import { TopLeftButton } from "../styled/home.styled";
import { AiOutlineHome } from "react-icons/ai";
import { useCallback, useReducer, useMemo, createContext } from "react";
import { MemoizedSingleMyGame } from "../components/SingleMyGame";
import {
  StateType,
  ActionType,
  GameDispatch,
  START_GAME,
  CLICK_BLOCK,
} from "../types/game.type";
import { MemoizedGameStartModal } from "../components/GameStartModal";
import { GamePageWrapper } from "../styled/game.styled";
import { SingleGameContext } from "./SingleGamePage";

const initalState: StateType = {
  start: false,
  end: false,
  playersNum: 1,
  turn: 0,
  endTurn: false,
  blockNum: 1,
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

const myId = 1;

export default function TutorialPage() {
  const [state, dispatch] = useReducer(reducer, initalState);
  const { turn, start, trigerClick, clickedBlock } = state;

  const handleNewGame = useCallback(() => {
    dispatch({ type: START_GAME });
  }, []);

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
    <>
      <TutorialPageWrapper>
        <TopLeftButton to="/main">
          <AiOutlineHome size="30" color="black" />
        </TopLeftButton>
        <GamePageWrapper>
          <SingleGameContext.Provider value={value}>
            <MemoizedSingleMyGame
              turn={turn}
              userId={myId}
              row={4}
              column={3}
            />
          </SingleGameContext.Provider>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1>튜토리얼</h1>
            <br />
            <h2>게임 방식</h2>
            <p>화면을 치는 모션으로 런치패드를 칠 수 있습니다.</p>
            <br />
            <br />
            <h2>대전 모드</h2>
            <p>
              런치패드를 치는 순서를 최대한 많이 기억하는 암기력 대전
              게임입니다.
              <br />
              상대방과 턴을 주고받으면서, 상대방이 쳤던 런치패드 순서를 기억하고
              따라친 후<br />한 칸을 더 치는 것으로 턴을 종료합니다.
            </p>
            <br />
            <br />
            <h2>싱글 모드</h2>
            <p>혼자서 런치패드를 조작할 수 있는 모드입니다.</p>
          </div>
          <MemoizedGameStartModal show={start} onStartGame={handleNewGame} />
        </GamePageWrapper>
      </TutorialPageWrapper>
    </>
  );
}
