import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import tetris_banner from "/tetris_banner2.png";

type Room = {
  roomId: string;
};

const roomList: Room[] = [
  { roomId: "room1" },
  { roomId: "room2" },
  { roomId: "room3" },
  { roomId: "room4" },
  { roomId: "room5" },
  { roomId: "room6" },
  { roomId: "room7" },
  { roomId: "room8" },
  { roomId: "room9" },
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
  padding-left: 400px;
`;

const Banner = styled.div`
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${tetris_banner});
  background-size: cover;
  height: 900px;
  width: 1500px;
`;

export default function RoomListPage() {
  return (
    <RoomListPageWrapper>
      <Banner />
      <Row xs={1} md={2} className="g-4">
        {roomList.map((roomInfo, idx) => (
          <Col key={idx}>
            <Card
              border={colorList[idx % colorList.length].toLowerCase()}
              bg="dark"
              text="light"
              style={{
                fontFamily: "Ramche",
                width: "43rem",
                height: "15rem",
                borderRadius: 20,
                border: "2px solid",
                marginLeft: 30,
                marginBottom: 10,
                overflow: "hidden",
              }}
            >
              <Card.Header>{roomInfo.roomId}</Card.Header>
              <Card.Body>
                <Card.Text>This is a 게임방입니다.</Card.Text>
              </Card.Body>
              <Button
                style={{ borderRadius: 0 }}
                variant={colorList[idx % colorList.length].toLowerCase()}
              >
                Join
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </RoomListPageWrapper>
  );
}
