import { Button } from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import { RoomData } from "../types/roomType";
import {
  RoomListPageWrapper,
  FormWrapper,
  RoomWrapper,
  RoomListColor,
  InputGroup,
  SubmitButton,
  InputField,
  MotionButton,
} from "../styled/rooms.styled";
import { useNavigate, NavLink } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import { colorList } from "../styled/game.styled";
import { motion, AnimatePresence } from "framer-motion";
import HomeButton from "../components/HomeButton";
import { ROW_LENGTH, COL_LENGTH } from "../types/game.type";
import { Overlay } from "../styled/rooms.styled";
import { playHoverBtnAudio } from "../utils/audio";

const emptyRoom: RoomData = {
  roomId: "Empty",
  description: "",
  peersNum: -1,
};

const initialRoomList: RoomData[] = [
  { roomId: "room1", description: "This is Room 1!!!", peersNum: 0 },
  { roomId: "room2", description: "This is Room 2!!!", peersNum: 0 },
  { roomId: "room3", description: "This is Room 3!!!", peersNum: 0 },
];

for (let i = 0; i < 6; i++) {
  initialRoomList.push(emptyRoom);
}

export default function RoomListPage() {
  const [room, setRoom] = useState<RoomData | null>(null);
  const [roomColor, setRoomColor] = useState<string | null>(null);
  const [roomList, setRoomList] = useState<RoomData[]>(initialRoomList);

  const navigate = useNavigate();

  const newRoomNameRef = useRef<HTMLInputElement>(null);
  const handlenewRoomNameRefSubmit = useCallback(() => {
    alert(`[${newRoomNameRef.current!.value}] 방이 생성되었습니다 :)`);
    let gameMode = "game";
    if (newRoomNameRef.current!.value.toLowerCase().includes("solo")) {
      gameMode = "sologame";
    }
    navigate(`/${gameMode}/${newRoomNameRef.current!.value}`);
  }, [newRoomNameRef, navigate]);

  useEffect(() => {
    const tempRoomList: RoomData[] = [];
    fetchData()
      .then((res) => {
        const peersNum = Object.keys(res).length;
        if (peersNum > 0) {
          Object.keys(res).forEach((key) => {
            tempRoomList.push({
              roomId: key,
              description: `[${key}] 방입니다!`,
              peersNum: peersNum,
            });
          });
          for (let i = 0; i < ROW_LENGTH * COL_LENGTH - peersNum; i++) {
            tempRoomList.push(emptyRoom);
          }
          setRoomList(tempRoomList);
        }
      })
      .catch(() => {
        console.log("data is nothing in server");
      });
  }, []);

  useEffect(() => {
    if (room) {
      document.body.style.overflow = "hidden"; // 모달 열릴 때 스크롤 막기
    } else {
      document.body.style.overflow = "auto"; // 모달 닫힐 때 스크롤 허용
    }
  }, [room]);

  return (
    <>
      <RoomListPageWrapper>
        <AnimatePresence>
          {room ? (
            <Overlay
              onClick={() => {
                setRoom(null);
                setRoomColor(null);
              }}
              initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              animate={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
              exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
              <motion.div
                layoutId={room.roomId}
                style={{
                  backgroundColor: "white",
                  width: "25rem",
                  height: "25rem",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <h1 style={{ marginBottom: "100px" }}>참가하시겠습니까?</h1>

                <h3>
                  {room.description}
                  <br />
                  {room.roomId == "Empty" ? "" : `현재인원 ${room.peersNum!}`}
                </h3>

                <NavLink
                  to={`/game/${room?.roomId}`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  <MotionButton
                    style={{
                      backgroundColor: roomColor!,
                      marginTop: "3vh",
                      width: "17vw",
                      height: "4vh",
                      borderRadius: "5%",
                      bottom: 0,
                      fontWeight: "bold",
                      letterSpacing: "2px",
                    }}
                  >
                    Join
                  </MotionButton>
                </NavLink>
              </motion.div>
            </Overlay>
          ) : null}
        </AnimatePresence>
        <HomeButton />
        <FormWrapper onSubmit={handlenewRoomNameRefSubmit}>
          <InputGroup>
            <InputField placeholder="Room ID" ref={newRoomNameRef} />
            <SubmitButton type="submit">Create Room</SubmitButton>
          </InputGroup>
        </FormWrapper>

        <table style={{ borderCollapse: "separate", borderSpacing: "30px" }}>
          <tbody>
            {Array(ROW_LENGTH)
              .fill(0)
              .map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {roomList
                    ?.slice(
                      rowIndex * ROW_LENGTH,
                      rowIndex * COL_LENGTH + ROW_LENGTH,
                    )
                    .map((roomInfo, idx) => (
                      <td key={idx}>
                        <RoomWrapper
                          whileHover={{ scale: 1.1 }}
                          onHoverStart={playHoverBtnAudio}
                          layoutId={roomInfo.roomId}
                          style={{
                            backgroundColor: `${
                              RoomListColor[
                                (rowIndex * COL_LENGTH + idx) %
                                  RoomListColor.length
                              ]
                            }`,
                            color: `${
                              (rowIndex * COL_LENGTH + idx) % 2 == 0
                                ? "white"
                                : "black"
                            }`,
                          }}
                          onClick={() => {
                            if (roomInfo.roomId !== "Empty") {
                              setRoom(roomInfo);
                              setRoomColor(
                                colorList[
                                  (rowIndex * COL_LENGTH + idx) %
                                    colorList.length
                                ],
                              );
                            }
                          }}
                        >
                          <div style={{ marginBottom: "50px" }}>
                            <h1>{roomInfo.roomId}</h1>
                          </div>

                          {/* <h3>{roomInfo.description}</h3> */}
                          <p style={{ marginTop: "10px" }}>
                            {roomInfo.roomId == "Empty"
                              ? "현재인원 0명"
                              : `현재인원 ${roomInfo.peersNum!}명`}
                          </p>
                        </RoomWrapper>
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </RoomListPageWrapper>
    </>
  );
}
