import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import tetris_banner from "/tetris_banner2.png";
import { useState } from "react";
import RoomJoinModal from "../components/RoomJoinModal";
import { Room } from "../types/rooms";

const roomList: Room[] = [
  { roomId: "room1", description: "This is Room 1!!!" },
  { roomId: "room2", description: "This is Room 2!!!" },
  { roomId: "room3", description: "This is Room 3!!!" },
  { roomId: "room4", description: "This is Room 4!!!" },
  { roomId: "room5", description: "This is Room 5!!!" },
  { roomId: "room6", description: "This is Room 6!!!" },
  { roomId: "room7", description: "This is Room 7!!!" },
  { roomId: "room8", description: "This is Room 8!!!" },
  { roomId: "room9", description: "This is Room 9!!!" },
];

const colorList: string[] = [
  "Primary",
  "Secondary",
  "Success",
  "Danger",
  "Warning",
  "Info",
  "Light",
];

const RoomListPageWrapper = styled.div`
  flex-direction: column;
  background-color: #000000;
  background-attachment: fixed;
  padding-left: 400px;
  top: 0;
`;

const Banner = styled.div`
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${tetris_banner});
  background-size: cover;
  height: 900px;
  width: 1500px;
`;

const RoomListWrapper = styled.div``;

export default function RoomListPage() {
  const [modalShow, setModalShow] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);

  return (
    <>
      <RoomListPageWrapper>
        <Banner />
        <RoomListWrapper>
          <Row xs={1} md={2} className="g-4">
            {roomList.map((roomInfo, idx) => (
              <Col>
                <Card
                  key={idx}
                  border={colorList[idx % colorList.length].toLowerCase()}
                  bg="dark"
                  text="light"
                  style={{
                    fontFamily: "Ramche",
                    width: "43rem",
                    height: "15rem",
                    borderRadius: 20,
                    border: "4px solid",
                    marginLeft: 30,
                    marginBottom: 10,
                    overflow: "hidden",
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
