import { Button, Form, Card, Col, Row } from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import RoomJoinModal from "../components/RoomJoinModal";
import { RoomData } from "../types/roomType";
import {
  Banner,
  RoomListPageWrapper,
  RoomListWrapper,
} from "../styled/rooms.styled";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchData";

const colorList: string[] = [
  "Primary",
  "Secondary",
  "Success",
  "Danger",
  "Warning",
  "Info",
  "Light",
];

export default function RoomListPage() {
  const [modalShow, setModalShow] = useState(false);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [roomList, setRoomList] = useState<RoomData[] | null>([
    { roomId: "room1", description: "This is Room 1!!!" },
    { roomId: "room2", description: "This is Room 2!!!" },
  ]);

  const navigate = useNavigate();

  const newRoomId = useRef<HTMLInputElement>();
  const handleNewRoomIdSubmit = useCallback(() => {
    alert(`Room: ${newRoomId.current!.value} created!`);
    navigate(`/game/${newRoomId.current!.value}`);
  }, [newRoomId, navigate]);

  useEffect(() => {
    const tempRoomList: RoomData[] = [];
    fetchData()
      .then((res) => {
        Object.entries(res).forEach(([key, value]) => {
          const { roomId, ...rest } = value;
          tempRoomList.push({
            roomId: key,
            description: `This is room ${key}`,
            ...rest,
          });
        });
        setRoomList(tempRoomList);
      })
      .catch(() => {
        console.log("data is nothing in server");
      });
  }, []);

  return (
    <>
      <RoomListPageWrapper>
        <Banner />
        <form>
          <label>Room ID</label>
          <input placeholder="Room ID" ref={newRoomId}></input>
          <Button variant="primary" onClick={handleNewRoomIdSubmit}>
            Join
          </Button>
        </form>

        <RoomListWrapper>
          <Row xs={1} md={2} className="g-4">
            {roomList?.map((roomInfo, idx) => (
              <Col key={idx}>
                <Card
                  key={idx}
                  border={colorList[idx % colorList.length].toLowerCase()}
                  bg="dark"
                  text="light"
                  style={{
                    fontFamily: "Ramche",
                    width: "30rem",
                    height: "15rem",
                    borderRadius: 20,
                    border: "4px solid",
                    marginLeft: 30,
                    marginBottom: 10,
                    boxShadow: "5px 5px 10px #f4aab9",
                  }}
                >
                  <Card.Header>
                    <h3>{roomInfo.roomId}</h3>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>{roomInfo.description}</Card.Text>
                  </Card.Body>

                  <Button
                    variant={colorList[idx % colorList.length].toLowerCase()}
                    style={{
                      borderRadius: 0,
                      color:
                        colorList[idx % colorList.length].toLowerCase() ===
                        "light"
                          ? "black"
                          : "white",
                    }}
                    onClick={() => {
                      setRoom(roomInfo);
                      setModalShow(true);
                    }}
                  >
                    Join
                  </Button>
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
