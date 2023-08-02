import { Button, Card, Col, Row } from "react-bootstrap";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  FormEvent,
  memo,
} from "react";
import RoomJoinModal from "../components/RoomJoinModal";
import { RoomData } from "../types/roomType";
import {
  RoomListPageWrapper,
  RoomListWrapper,
  FormWrapper,
} from "../styled/rooms.styled";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import { colorList } from "../styled/game.styled";

const emptyRoom: RoomData = {
  roomId: "Empty",
  description: "빈 방입니다.",
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
for (let i = 0; i < 10; i++) {
  initialRoomList.push(emptyRoom);
}

function RoomListPage() {
  const [modalShow, setModalShow] = useState(false);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [roomList, setRoomList] = useState<RoomData[]>(initialRoomList);

  const navigate = useNavigate();

  const newRoomId = useRef<HTMLInputElement>();
  const handleNewRoomIdSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      alert(`[${newRoomId.current!.value}] 방이 생성되었습니다 :)`);
      let gameMode = "game";
      if (newRoomId.current!.value.toLowerCase().includes("solo")) {
        gameMode = "sologame";
      }
      navigate(`/${gameMode}/${newRoomId.current!.value}`);
    },
    [newRoomId, navigate],
  );

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
          for (let i = 0; i < 16 - peersNum; i++) {
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
        <FormWrapper>
          <input placeholder="Room ID" ref={newRoomId}></input>
          <Button variant="primary" onSubmit={handleNewRoomIdSubmit}>
            Join
          </Button>
        </FormWrapper>

        <RoomListWrapper>
          <Row xs={4} md={4} className="g-5">
            {roomList?.map((roomInfo, idx) => (
              <Col key={idx}>
                <Card
                  key={idx}
                  style={{
                    width: "15rem",
                    height: "15rem",
                    borderRadius: 15,
                    boxShadow: `5px 5px 10px ${
                      colorList[idx % colorList.length]
                    }`,
                  }}
                  onClick={() => {
                    setRoom(roomInfo);
                    setModalShow(true);
                  }}
                >
                  <Card.Header>
                    <h3>{roomInfo.roomId}</h3>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>{roomInfo.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Card.Text>현재인원 {roomInfo.peersNum}</Card.Text>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </RoomListWrapper>
        <RoomJoinModal
          roomInfo={room}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </RoomListPageWrapper>
    </>
  );
}

export default memo(RoomListPage);
