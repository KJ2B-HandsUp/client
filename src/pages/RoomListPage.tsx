import { Button } from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import RoomJoinModal from "../components/RoomJoinModal";
import { RoomData } from "../types/roomType";
import { RoomListPageWrapper, FormWrapper } from "../styled/rooms.styled";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import { colorList } from "../styled/game.styled";
import { TopLeftButton } from "../styled/home.styled";
import { AiOutlineHome } from "react-icons/ai";
import { motion } from "framer-motion";

const emptyRoom: RoomData = {
  roomId: "Empty",
  description: "",
  peersNum: -1,
};
const initialRoomList: RoomData[] = [
  { roomId: "room1", description: "This is Room 1!!!", peersNum: 0 },
  { roomId: "soloroom1", description: "솔로 모드 입니다 :)", peersNum: 0 },
  { roomId: "room2", description: "This is Room 2!!!", peersNum: 0 },
  { roomId: "room3", description: "This is Room 3!!!", peersNum: 0 },
  { roomId: "soloroom2", description: "솔로 모드 입니다 :)", peersNum: 0 },
  { roomId: "soloroom3", description: "솔로 모드 입니다 :)", peersNum: 0 },
];
for (let i = 0; i < 6; i++) {
  initialRoomList.push(emptyRoom);
}

const spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
};

export default function RoomListPage() {
  const [modalShow, setModalShow] = useState(false);
  const [room, setRoom] = useState<RoomData | null>(null);
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
          Object.entries(res).forEach(([key, value]) => {
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

  return (
    <>
      <RoomListPageWrapper>
        <TopLeftButton to="/main">
          <AiOutlineHome size="30" color="black" />
        </TopLeftButton>
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
                          transition={spring}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.8 }}
                          style={{
                            backgroundColor: "white",
                            opacity: 0.8,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                            width: "18rem",
                            height: "18rem",
                            boxShadow: `5px 5px 10px ${
                              colorList[(rowIndex * 3 + idx) % colorList.length]
                            }`,
                          }}
                          onClick={() => {
                            if (roomInfo.roomId !== "Empty") {
                              setRoom(roomInfo);
                              setModalShow(true);
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

        <RoomJoinModal
          roomInfo={room}
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
        />
      </RoomListPageWrapper>
    </>
  );
}
