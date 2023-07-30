import {
  useRef,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
  createContext,
  memo,
} from "react";
import {
  signalNewConsumerTransport,
  closeProducer,
  streamSuccess,
} from "../utils/socketio";
import { io, Socket } from "socket.io-client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import MyGame from "../components/MyGame";
import OtherUserGame from "../components/OtherUserGame";
import {
  StateType,
  ActionType,
  GameDispatch,
  START_GAME,
  CHANGE_TURN,
  CLICK_BLOCK,
} from "../types/game.type";

const initalState: StateType = {
  started: false,
  userNum: 2,
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
        turn: (state.turn + 1) % state.userNum,
        endTurn: false,
        blockNum: state.blockNum + 1,
        blockList: [],
        prevBlockList: [...state.blockList],
      };
    }
    default:
      return state;
  }
};

export const GameContext = createContext<GameDispatch>({
  started: false,
  dispatch: () => {},
});

function GamePage() {
  //console.log("gamepage rendered");

  const [state, dispatch] = useReducer(reducer, initalState);
  const { turn, started, endTurn, winner } = state;

  const playersVideoRef = useRef<HTMLVideoElement>(null);

  const { roomId } = useParams();
  const socket = useRef<Socket>();
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
    if (socket.current != undefined) {
      socket.current = io("https://choijungle.shop/mediasoup");

      window.addEventListener("beforeunload", handleBeforeUnload);

      socket.current.on("connection-success", () => {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: true,
          })
          .then(async (stream) => {
            if (roomId !== undefined) {
              await streamSuccess(stream, socket.current!, roomId).then(
                (mediaStreamList) => {
                  if (playersVideoRef.current && mediaStreamList[0]) {
                    playersVideoRef.current.srcObject = mediaStreamList[0];
                  }
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
            const player1Stream = await signalNewConsumerTransport(
              producerId,
              socket.current!,
            );
            if (playersVideoRef.current && player1Stream) {
              playersVideoRef.current.srcObject = player1Stream;
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
        },
      );
    }

    if (endTurn) {
      dispatch({ type: CHANGE_TURN });
    }

    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload, roomId, endTurn]);

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
              <OtherUserGame turn={turn} id={1} row={4} column={4} />
            </Col>
          </Row>
        </Container>
      </GameContext.Provider>
      {winner > -1 ? <div>Winner: ${winner}</div> : null}
    </>
  );
}

export default GamePage;
