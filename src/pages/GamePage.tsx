import {
  useRef,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
  createContext,
} from "react";
import {
  closeProducer,
  signalNewConsumerTransport,
  streamSuccess,
} from "../utils/socketio";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import MyGame from "../components/MyGame";
import {
  TransferDataType,
  UserType,
  StateType,
  ActionType,
  GameDispatch,
  START_GAME,
  CHANGE_TURN,
  CLICK_BLOCK,
  ADD_PLAYER,
  OTHER_PLAYER_CLICK,
  OTHER_CHANGE_TURN,
} from "../types/game.type";
import {
  CardListContainer,
  CAMERA_VIEW_WIDTH,
  CAMERA_VIEW_HEIGHT,
} from "../styled/game.styled";
import OtherVideoList from "../components/OtherVideoList";
import GameOverModal from "../components/GameOverModal";
import GameStartModal from "../components/GameStartModal";

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

let dataSocket: Socket;
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case START_GAME:
      if (!state.start) {
        if (dataSocket != undefined) {
          dataSocket.emit("get_game_data", {
            type: "START",
          } as TransferDataType);
        }
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
      }
      return state;
    case CLICK_BLOCK: {
      const idx = state.blockList.length;
      if (dataSocket != undefined && !state.trigerClick && myId == state.turn) {
        dataSocket.emit("get_game_data", {
          type: "CLICK",
          userId: myId,
          clickedBlock: {
            rowIndex: action.clickedBlock.rowIndex,
            colIndex: action.clickedBlock.colIndex,
          },
        } as TransferDataType);
      }
      // 따라치는 중
      if (0 <= idx && idx < state.blockNum && state.prevBlockList.length > 0) {
        // 틀렸을 때. 바로 실패
        if (
          state.prevBlockList[idx].rowIndex !== action.clickedBlock.rowIndex ||
          state.prevBlockList[idx].colIndex !== action.clickedBlock.colIndex
        ) {
          console.log("Game Over");
          return {
            ...state,
            turn: -1,
            start: false,
            end: true,
            winner: action.userId,
            trigerClick: false,
          };
        }

        return {
          ...state,
          blockList: [...state.blockList, action.clickedBlock],
          trigerClick: false,
        };
      }
      // 따라친거 +1칸
      return {
        ...state,
        endTurn: true,
        blockList: [...state.blockList, action.clickedBlock],
        trigerClick: false,
      };
    }
    case CHANGE_TURN: {
      console.log("change turn");
      return {
        ...state,
        turn: (state.turn % state.playersNum) + 1,
        endTurn: false,
        blockNum: state.blockNum + 1,
        blockList: [],
        prevBlockList: [...state.blockList],
      };
    }
    case ADD_PLAYER:
      return {
        ...state,
        playersNum: state.playersNum + action.num,
      };
    case OTHER_PLAYER_CLICK:
      return {
        ...state,
        trigerClick: true,
        clickedBlock: action.clickedBlock,
      };
    case OTHER_CHANGE_TURN:
      console.log("change turn by other player");
      return {
        ...state,
        turn: ((state.turn + 1) % state.playersNum) + 1,
        endTurn: false,
        blockNum: state.blockNum + 1,
        blockList: [],
        prevBlockList: [...state.blockList],
      };
    default:
      return state;
  }
};

export const GameContext = createContext<GameDispatch>({
  start: false,
  dispatch: () => {
    /* default implementation or no-op */
  },
  trigerClick: false,
  clickedBlock: { rowIndex: -1, colIndex: -1 },
});

let userList: UserType[] = [];
let myId = 1;

function GamePage() {
  //console.log("gamepage rendered");

  const [state, dispatch] = useReducer(reducer, initalState);
  const {
    playersNum,
    turn,
    start,
    end,
    endTurn,
    winner,
    trigerClick,
    clickedBlock,
  } = state;

  const { roomId } = useParams();
  const socket = useRef<Socket>();

  const handleBeforeUnload = useCallback(() => {
    socket.current!.emit("disconnect");
  }, []);

  const handleNewGame = useCallback(() => {
    dispatch({ type: START_GAME });
  }, []);

  useEffect(() => {
    if (socket.current == undefined) {
      socket.current = io("https://choijungle.shop/mediasoup");

      window.addEventListener("beforeunload", handleBeforeUnload);

      socket.current.on("connection-success", () => {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              frameRate: { ideal: 15, max: 20 },
              width: 600,
              height: 600,
            },
          })
          .then(async (stream) => {
            if (roomId !== undefined) {
              console.log(stream);
              await streamSuccess(stream, socket.current!, roomId).then(
                (mediaStreamList) => {
                  console.log(mediaStreamList);
                  mediaStreamList.map((mediaData, idx) => {
                    if (mediaData) {
                      console.log("Success: get new producer video list");
                      console.log(mediaData);
                      userList.push({
                        id: idx + 1,
                        name: mediaData.producerId,
                        stream: mediaData.mediaStream,
                      });
                    }
                  });
                  dispatch({ type: ADD_PLAYER, num: mediaStreamList.length });
                  myId = mediaStreamList.length + 1;
                },
              );
            }
          })
          .catch((error: Error) => {
            console.error(error.message);
          });
      });

      socket.current.on(
        "new-producer",
        async ({ producerId }: { producerId: string }) => {
          try {
            const mediaStream = await signalNewConsumerTransport(
              producerId,
              socket.current!,
            );

            if (mediaStream) {
              console.log("Success: get new producer video");
              userList.push({
                id: playersNum + 1,
                name: producerId,
                stream: mediaStream,
              });
              dispatch({ type: ADD_PLAYER, num: 1 });
            }
          } catch (error) {
            console.error("Failed to signal new consumer transport:", error);
          }
        },
      );

      socket.current.on(
        "producer-closed",
        ({ remoteProducerId }: { remoteProducerId: string }): void => {
          closeProducer(remoteProducerId);
          userList = userList.filter((user) => user.name !== remoteProducerId);
          dispatch({ type: ADD_PLAYER, num: -1 });
        },
      );

      dataSocket = io("https://choijungle.shop/data");

      dataSocket.on("connection-success", () => {
        console.log(`dataSocket: connection-success`);
      });

      dataSocket.on("send_game_data", (res: { data: TransferDataType }) => {
        console.log(res.data);
        switch (res.data.type) {
          case "START":
            dispatch({ type: START_GAME });
            break;
          case "TURN":
            dispatch({ type: OTHER_CHANGE_TURN });
            break;
          case "CLICK":
            dispatch({
              type: OTHER_PLAYER_CLICK,
              userId: res.data.userId,
              clickedBlock: {
                rowIndex: res.data.clickedBlock.rowIndex,
                colIndex: res.data.clickedBlock.colIndex,
              },
            });
            break;
        }
      });
    }
    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (endTurn) {
      dispatch({ type: CHANGE_TURN });
    }
  }, [endTurn]);

  const value = useMemo(
    () => ({
      start: start,
      dispatch: dispatch,
      trigerClick: trigerClick,
      clickedBlock: clickedBlock,
    }),
    [start, trigerClick],
  );
  //console.log("myId: ", myId);
  console.log("current turn: ", turn, " myId: ", myId);
  return (
    <>
      <GameContext.Provider value={value}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <MyGame turn={turn} id={myId} row={4} column={4} />
          <OtherVideoList
            turn={turn}
            users={userList}
            userNum={playersNum - 1}
          />
        </div>
      </GameContext.Provider>
      <GameStartModal show={start} onStartGame={handleNewGame} />
      <GameOverModal
        show={end}
        winner={winner.toString()}
        onStartGame={handleNewGame}
      />
    </>
  );
}

export default GamePage;
