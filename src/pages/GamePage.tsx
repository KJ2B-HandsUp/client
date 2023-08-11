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
} from "../types/game.type";
import { MemoizedOtherUserVideoView } from "../components/OtherUserVideoView";
import { DefaultProfile, GamePageWrapper } from "../styled/game.styled";
import { AnimatePresence } from "framer-motion";
import { Overlay } from "../styled/rooms.styled";
import {
  GameOverAudio,
  GameStartAudio,
  pauseBGMAudio,
  playBGMAudio,
} from "../utils/audio";
import { takeScreenshot } from "../utils/takeScreenshot";
import CountdownModal from "../components/CountdownModal";
import HoverCard from "../components/HoverCard";
import CSSButtonComponent from "../components/CSSButtonComponent";
import { AiOutlineDownload } from "react-icons/ai";
import SpaceBackground from "../components/SpaceBackground";
import axios from "axios";
import { MemoizedUserProfile } from "../components/UserProfile";

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
let myId = 1;

let dataSocket: Socket;
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case START_GAME:
      if (!state.start) {
        //console.log("start game");
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
      if (dataSocket != undefined && !state.trigerClick && myId == state.turn) {
        //console.log("Click Block");
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
          //console.log("Game Over");
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
      //console.log("change turn");
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
      //console.log("clicked by other player");
      return {
        ...state,
        trigerClick: true,
        clickedBlock: action.clickedBlock,
      };
    case OTHER_CHANGE_TURN:
      //console.log("change turn by other player");
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
    scale: 0.1,
    opacity: 0.3, // 흐려진 상태에서 시작
  },
  visible: {
    opacity: 1, // 선명하게 표시
    scale: [1.2, 1],
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  exit: {
    scale: 0.1,
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

export default function GamePage() {
  console.log("GamePage rendered");

  const [myProfile, setMyProfile] = useState<UserType>({
    userId: 1,
    nickname: "김민석",
    profile_image_url: DefaultProfile,
  });
  const [otherUser, setOtherUser] = useState<UserType>({
    userId: 2,
    nickname: "대기중...",
    profile_image_url: DefaultProfile,
  });

  useEffect(() => {
    const getUserProfile = () => {
      axios
        .get(`${import.meta.env.VITE_LOGINSERVER_IP}/profile`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          console.log(data);
          setMyProfile(() => {
            return {
              userId: 1,
              nickname: data.data.properties["nickname"] as string,
              profile_image_url: data.data.properties[
                "profile_image"
              ] as string,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          setMyProfile({
            userId: 1,
            nickname: "김민석",
            profile_image_url: DefaultProfile,
          });
        });
    };
    getUserProfile();
  }, []);

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
    if (socket.current == undefined && !dataSocket) {
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
          case "PROFILE":
            console.log("get profile", res.data);
            setOtherUser((state) => {
              return {
                ...state,
                nickname: res.data.nickname!,
                profile_image_url: res.data.profile_image_url!,
              };
            });
            break;
          default:
            break;
        }
      });

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
                myId = 2;
                setMyProfile((state) => {
                  return { ...state, userId: myId };
                });
                // 내가 들어갔을 떄 못 받아온다
                // 내 프로필 보내기
                if (dataSocket != undefined) {
                  console.log("Send Profile1");
                  dataSocket.emit("get_game_data", {
                    type: "PROFILE",
                    userId: myProfile.userId,
                    nickname: myProfile.nickname,
                    profile_image_url: myProfile.profile_image_url,
                  } as TransferDataType);
                  setOtherUser((state) => {
                    return {
                      ...state,
                      userId: 1,
                      stream: tracks["video"],
                      audioStream: tracks["audio"],
                    };
                  });
                  dispatch({ type: ADD_PLAYER, num: 1 });
                }
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
            // console.log(mediaStream);
            console.log(tracks);
            if ("audio" in tracks && "video" in tracks) {
              // console.log("Success: get new producer video");

              setOtherUser((state) => {
                return {
                  ...state,
                  userId: 2,
                  stream: tracks["video"],
                  audioStream: tracks["audio"],
                };
              });
              if (dataSocket != undefined) {
                console.log("Send Profile2");
                dataSocket.emit("get_game_data", {
                  type: "PROFILE",
                  userId: myProfile.userId,
                  nickname: myProfile.nickname,
                  profile_image_url: myProfile.profile_image_url,
                } as TransferDataType);
                dispatch({ type: ADD_PLAYER, num: 1 });
              }
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

          setOtherUser((state) => {
            return {
              ...state,
              userId: 1,
              nickname: "대기 중..",
              profile_image_url: DefaultProfile,
            };
          });
          myId = 1;
          setMyProfile((state) => {
            return {
              ...state,
              userId: 1,
            };
          });
          dispatch({ type: ADD_PLAYER, num: -1 });
        },
      );
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
    <SpaceBackground>
      <GamePageWrapper>
        <GameContext.Provider value={value}>
          <MemoizedMyGame
            turn={turn}
            userId={myProfile.userId}
            nickname={myProfile.nickname}
          />
          <MemoizedOtherUserVideoView
            turn={turn}
            user={otherUser}
            userNum={playersNum - 1}
          />
        </GameContext.Provider>
      </GamePageWrapper>

      <AnimatePresence>
        {!start && winner == -1 ? (
          <Overlay
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          >
            <HoverCard
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              header={"Ready?"}
              style={{ width: "50vw", height: "70vh" }}
            >
              <CountdownModal onClick={handleNewGame} />
              <NavLink
                to={`/main`}
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <CSSButtonComponent
                  onClick={() => {
                    handleBeforeUnload();
                  }}
                >
                  Home
                </CSSButtonComponent>
              </NavLink>
            </HoverCard>
          </Overlay>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {gameOverState ? (
          <Overlay
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          >
            <HoverCard
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              header={
                <div color="yellow">
                  {myProfile.userId === winner
                    ? "그럴 수 있어. 이런 날도 있는거지 뭐."
                    : "이겼닭! 오늘 저녁은 치킨이닭!"}
                </div>
              }
              style={{ width: "60vw", height: "95vh" }}
            >
              {screenshotData && (
                <img
                  src={screenshotData}
                  alt="screenshot"
                  style={{ margin: "20px", width: "40vw", height: "40vh" }}
                />
              )}
              <a ref={downloadLinkRef} style={{ display: "none" }}>
                Download
              </a>
              <button onClick={() => downloadLinkRef.current?.click()}>
                <AiOutlineDownload size="30" />
              </button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <CountdownModal onClick={handleNewGame} />
                <NavLink to="/main">
                  <CSSButtonComponent
                    onClick={() => {
                      handleBeforeUnload();
                    }}
                  >
                    Home
                  </CSSButtonComponent>
                </NavLink>
              </div>
            </HoverCard>
          </Overlay>
        ) : null}
      </AnimatePresence>
      <MemoizedUserProfile
        user={myProfile}
        style={{ bottom: "20px", left: "100px" }}
      />
      <MemoizedUserProfile
        user={otherUser}
        style={{ bottom: "20px", right: "100px" }}
      />
    </SpaceBackground>
  );
}
