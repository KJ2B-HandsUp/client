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
    <GamePageWrapper>
      <SingleGameContext.Provider value={value}>
        <MemoizedSingleMyGame turn={turn} userId={myId} row={4} column={3} />
      </SingleGameContext.Provider>
      <MemoizedGameStartModal show={start} onStartGame={handleNewGame} />
    </GamePageWrapper>
  );
}
