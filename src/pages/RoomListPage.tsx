import { Button } from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import { RoomData } from "../types/roomType";
import { RoomListPageWrapper, FormWrapper } from "../styled/rooms.styled";
import { useNavigate, NavLink } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import { colorList } from "../styled/game.styled";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "styled-components";
import HomeButton from "../components/HomeButton";

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

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
          for (let i = 0; i < 12 - peersNum; i++) {
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
              style={{
                width: "100vw",
                height: "100vh",
                zIndex: 100,
              }}
            >
              <motion.div
                layoutId={room.roomId}
                style={{
                  backgroundColor: "white",
                  width: "25rem",
                  height: "25rem",
                  borderRadius: "2%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <h3>{room.roomId}</h3>
                {room.description}
                <p>
                  {room.roomId == "Empty" ? "" : `현재인원 ${room.peersNum!}`}
                </p>

                <motion.button
                  style={{
                    backgroundColor: roomColor!,
                    marginTop: "3vh",
                    width: "17vw",
                    height: "4vh",
                    borderRadius: "5%",
                    bottom: 0,
                  }}
                >
                  <NavLink
                    to={`/game/${room?.roomId}`}
                    style={{
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    Join
                  </NavLink>
                </motion.button>
              </motion.div>
            </Overlay>
          ) : null}
        </AnimatePresence>
        <HomeButton />
        <FormWrapper onSubmit={handlenewRoomNameRefSubmit}>
          <input placeholder="Room ID" ref={newRoomNameRef}></input>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </FormWrapper>

        <table style={{ borderCollapse: "separate", borderSpacing: "30px" }}>
          <tbody>
            {Array(4)
              .fill(0)
              .map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {roomList
                    ?.slice(rowIndex * 3, rowIndex * 3 + 3)
                    .map((roomInfo, idx) => (
                      <td key={idx}>
                        <motion.div
                          layoutId={roomInfo.roomId}
                          whileHover={{ scale: 1.1 }}
                          style={{
                            backgroundColor: "white",
                            opacity: 0.8,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                            width: "18rem",
                            height: "18rem",
                            borderRadius: "2%",
                            boxShadow: `5px 5px 10px ${
                              colorList[(rowIndex * 3 + idx) % colorList.length]
                            }`,
                          }}
                          onClick={() => {
                            if (roomInfo.roomId !== "Empty") {
                              setRoom(roomInfo);
                              setRoomColor(
                                colorList[
                                  (rowIndex * 3 + idx) % colorList.length
                                ],
                              );
                            }
                          }}
                        >
                          <h3>{roomInfo.roomId}</h3>
                          {roomInfo.description}
                          <p>
                            {roomInfo.roomId == "Empty"
                              ? ""
                              : `현재인원 ${roomInfo.peersNum!}`}
                          </p>
                        </motion.div>
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
