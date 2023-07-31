import {
  useRef,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
  createContext,
  useState,
} from "react";
import {
  closeProducer,
  signalNewConsumerTransport,
  streamSuccess,
} from "../utils/socketio";
import { io, Socket } from "socket.io-client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import MyGame from "../components/MyGame";
import {
  UserType,
  StateType,
  ActionType,
  GameDispatch,
  START_GAME,
  CHANGE_TURN,
  CLICK_BLOCK,
  ADD_PLAYER,
} from "../types/game.type";
import { CardListContainer } from "../styled/game.styled";
import OtherVideoList from "../components/OtherVideoList";

const initalState: StateType = {
  started: false,
  playersNum: 1,
  turn: 0,
  endTurn: false,
  blockNum: 1,
  blockList: [],
  prevBlockList: [],
  winner: -1,
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        started: true,
        turn: 0,
        endTurn: false,
        blockNum: 0,
        blockList: [],
        prevBlockList: [],
        winner: -1,
      };
    case CLICK_BLOCK: {
      const idx = state.blockList.length;
      // 따라치는 중
      if (0 <= idx && idx < state.blockNum && state.prevBlockList.length > 0) {
        // 틀렸을 때. 바로 실패
        if (
          state.prevBlockList[idx].row !== action.clickedBlock.row ||
          state.prevBlockList[idx].column !== action.clickedBlock.column
        ) {
          return {
            ...state,
            turn: -1,
            started: false,
            winner: action.userId,
          };
        }

        return {
          ...state,
          blockList: [...state.blockList, action.clickedBlock],
        };
      }
      // 따라친거 +1칸
      return {
        ...state,
        endTurn: true,
        blockList: [...state.blockList, action.clickedBlock],
      };
    }
    case CHANGE_TURN: {
      console.log("change turn");
      return {
        ...state,
        turn: (state.turn + 1) % state.playersNum,
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
    default:
      return state;
  }
};

export const GameContext = createContext<GameDispatch>({
  started: false,
  dispatch: () => {},
});

let userList: UserType[] = [];

function GamePage() {
  //console.log("gamepage rendered");

  const [state, dispatch] = useReducer(reducer, initalState);
  const { playersNum, turn, started, endTurn, winner } = state;

  const { roomId } = useParams();
  const socket = useRef<Socket>();
  const dataSocket = useRef<Socket>();

  const handleBeforeUnload = useCallback(() => {
    socket.current!.emit("disconnect");
  }, []);

  const value = useMemo(
    () => ({
      started: started,
      dispatch: dispatch,
    }),
    [started],
  );

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
              width: 500,
              height: 500,
            },
          })
          .then(async (stream) => {
            if (roomId !== undefined) {
              console.log("done?1");
              console.log(stream);
              await streamSuccess(stream, socket.current!, roomId).then(
                (mediaStreamList) => {
                  console.log(mediaStreamList);
                  mediaStreamList.map((mediaData, idx) => {
                    if (mediaData) {
                      console.log("Success: get new producer video list");
                      console.log(mediaData);
                      userList.push({
                        id: playersNum + idx,
                        name: mediaData.producerId,
                        stream: mediaData.mediaStream,
                      });
                    }
                  });
                  dispatch({ type: ADD_PLAYER, num: mediaStreamList.length });
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
                id: playersNum,
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

      dataSocket.current = io("https://choijungle.shop/data");

      dataSocket.current.on("connection-success", () => {
        console.log(`dataSocket: connection-success`);
      });

      dataSocket.current.emit("get_game_data", { message: "hello" });

      dataSocket.current.on("send_game_data", (res) => {
        console.log("get: ", res);
      });
    }
    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload, roomId, playersNum]);

  useEffect(() => {
    if (endTurn) {
      dispatch({ type: CHANGE_TURN });
    }
  }, [endTurn]);

  return (
    <>
      <GameContext.Provider value={value}>
        <Container fluid="md">
          <button onClick={handleNewGame}>New Game</button>
          <Row xs={1} md={2} className="g-4">
            <Col>
              <MyGame turn={turn} id={0} row={4} column={4} />
            </Col>
            <Col>
              <CardListContainer>
                <OtherVideoList
                  turn={turn}
                  users={userList}
                  userNum={playersNum - 1}
                />
              </CardListContainer>
            </Col>
          </Row>
        </Container>
      </GameContext.Provider>
    </>
  );
}

export default GamePage;
