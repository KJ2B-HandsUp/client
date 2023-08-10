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
  tracks,
} from "../utils/socketio";
import { io, Socket } from "socket.io-client";
import { useParams, NavLink } from "react-router-dom";
import { MemoizedMyGame } from "../components/MyGame";
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
  ROW_LENGTH,
  COL_LENGTH,
} from "../types/game.type";
import { MemoizedOtherUserVideoView } from "../components/OtherUserVideoView";
import { MemoizedGameStartModal } from "../components/GameStartModal";
import { GamePageWrapper } from "../styled/game.styled";
import { AnimatePresence } from "framer-motion";
import { Overlay } from "../styled/rooms.styled";
import { motion } from "framer-motion";
import {
  GameOverAudio,
  GameStartAudio,
  pauseBGMAudio,
  playBGMAudio,
} from "../utils/audio";
import { takeScreenshot } from "../utils/takeScreenshot";

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
        console.log("start game");
        GameStartAudio.play();
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
      console.log(myId, state.turn);
      if (dataSocket != undefined && !state.trigerClick && myId == state.turn) {
        console.log("Click Block");
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
      console.log("clicked by other player");
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

const modalVariants = {
  hidden: {
    y: "100vh", // 바닥에서 시작
    opacity: 0.3, // 흐려진 상태에서 시작
  },
  visible: {
    y: "0%", // 화면 중앙으로 이동
    opacity: 1, // 선명하게 표시
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  exit: {
    y: "100vh", // 바닥으로 이동
    opacity: 0, // 완전히 흐려진 상태
    transition: {
      duration: 0.5,
    },
  },
};

export const GameContext = createContext<GameDispatch>({
  start: false,
  dispatch: () => {
    /* default implementation or no-op */
  },
  trigerClick: false,
  clickedBlock: { rowIndex: -1, colIndex: -1 },
  gameover: false,
});

let userList: UserType[] = [];
let myId = 1;

export default function GamePage() {
  console.log("GamePage rendered");

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
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const [screenshotData, setScreenshotData] = useState<string>();

  const [gameOverState, setGameOverState] = useState(false);

  const handleBeforeUnload = useCallback(() => {
    socket.current!.emit("disconnect");
  }, []);

  const handleNewGame = useCallback(() => {
    setGameOverState(false);
    dispatch({ type: START_GAME });
  }, []);

  useEffect(() => {
    if (socket.current == undefined) {
      socket.current = io(`${import.meta.env.VITE_MEDIASERVER_IP}/mediasoup`);

      window.addEventListener("beforeunload", handleBeforeUnload);

      socket.current.on("connection-success", () => {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              frameRate: { ideal: 15, max: 20 },
              width: 600,
              height: 800,
            },
            audio: true,
          })
          .then(async (stream) => {
            if (roomId !== undefined) {
              const mediaStreamList = await streamSuccess(
                stream,
                socket.current!,
                roomId,
              );
              console.log(tracks);
              console.log(mediaStreamList);
              const mediaData = mediaStreamList[0];
              if (
                mediaData &&
                Object.keys(tracks).length > 0 &&
                "video" in tracks &&
                "audio" in tracks
              ) {
                userList.push({
                  userId: 1,
                  nickname: mediaData!.producerId,
                  stream: tracks["video"],
                  audioStream: tracks["audio"],
                });
                dispatch({ type: ADD_PLAYER, num: 1 });
                myId = 2;
              }
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
            console.log(mediaStream);
            console.log(tracks);
            if ("audio" in tracks && "video" in tracks) {
              // console.log("Success: get new producer video");
              userList.push({
                userId: 2,
                nickname: producerId,
                stream: tracks["video"],
                audioStream: tracks["audio"],
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
          userList = userList.filter(
            (user) => user.nickname !== remoteProducerId,
          );
          dispatch({ type: ADD_PLAYER, num: -1 });
        },
      );

      dataSocket = io(`${import.meta.env.VITE_MEDIASERVER_IP}/data`);

      dataSocket.on("connection-success", () => {
        console.log(`dataSocket: connection-success`);
      });

      dataSocket.on("send_game_data", (res: { data: TransferDataType }) => {
        switch (res.data.type) {
          case "START":
            handleNewGame();
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
    playBGMAudio();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      pauseBGMAudio();
    };
  }, []);

  useEffect(() => {
    if (endTurn) {
      setTimeout(() => {
        dispatch({ type: CHANGE_TURN });
      }, 1000);
    }

    const fetch = async () => {
      const screenshot = await takeScreenshot();
      const downloadLink = downloadLinkRef.current;
      if (downloadLink) {
        downloadLink.href = screenshot;
        downloadLink.download = "screenshot.png";
        // downloadLink.click();
      }
      setScreenshotData(screenshot);
      GameOverAudio.play();
      setGameOverState(true);
    };

    if (end) {
      fetch();
    }
  }, [endTurn, end]);

  const value = useMemo(
    () => ({
      start: start,
      dispatch: dispatch,
      trigerClick: trigerClick,
      clickedBlock: clickedBlock,
      gameover: end,
    }),
    [start, trigerClick, end],
  );

  return (
    <>
      <GameContext.Provider value={value}>
        <GamePageWrapper>
          <MemoizedMyGame
            turn={turn}
            userId={myId}
            row={ROW_LENGTH}
            column={COL_LENGTH}
          />
          <MemoizedOtherUserVideoView
            turn={turn}
            users={userList}
            userNum={playersNum - 1}
          />
        </GamePageWrapper>
      </GameContext.Provider>
      <MemoizedGameStartModal
        show={start || end}
        onStartGame={handleNewGame}
        handleBeforeUnload={handleBeforeUnload}
      />
      <AnimatePresence>
        {gameOverState ? (
          <Overlay
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              style={{
                backgroundColor: "white",
                width: "60rem",
                height: "60rem",
                borderRadius: "2%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h1>{myId === winner ? "You Lose..." : "You Win!!!"}</h1>
              {screenshotData && (
                <img
                  src={screenshotData}
                  alt="screenshot"
                  style={{ margin: "20px", width: "50vw", height: "50vh" }}
                />
              )}

              <NavLink
                to={`/main`}
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <motion.button
                  onClick={() => {
                    handleBeforeUnload();
                  }}
                  style={{
                    marginTop: "3vh",
                    width: "17vw",
                    height: "4vh",
                    borderRadius: "5%",
                    bottom: 0,
                  }}
                >
                  home
                </motion.button>
              </NavLink>
              <motion.button
                onClick={() => {
                  handleNewGame();
                }}
                style={{
                  marginTop: "3vh",
                  width: "17vw",
                  height: "4vh",
                  borderRadius: "5%",
                  bottom: 0,
                }}
              >
                New Game
              </motion.button>
              <a ref={downloadLinkRef} href="/" style={{ display: "none" }}>
                Download
              </a>
              <button onClick={() => downloadLinkRef.current?.click()}>
                Download Screenshot
              </button>
            </motion.div>
          </Overlay>
        ) : null}
      </AnimatePresence>
    </>
  );
}
