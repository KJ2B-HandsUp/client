import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import RoomJoinModal from "../components/RoomJoinModal";
import { RoomData, RoomList } from "../types/roomType";
import { Banner, RoomListPageWrapper } from "../styled/styled-components.js";
import {
  getLocalStream,
  signalNewConsumerTransport,
  closeProducer,
} from "../utils/socketio";
import fetchData from "../utils/fetchData";

const colorList: string[] = [
  "Primary",
  "Secondary",
  "Success",
  "Danger",
  "Warning",
  "Info",
  "Light",
];

const RoomListWrapper = styled.div``;

export default function RoomListPage() {
  const [modalShow, setModalShow] = useState(false);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [roomList, setRoomList] = useState<RoomData[] | null>([
    { roomId: "room1", description: "This is Room 1!!!" },
    { roomId: "room2", description: "This is Room 2!!!" },
  ]);

  let socket;
  useMemo(() => {
    const tempRoomList: RoomData[] = [];
    fetchData()
      .then((res) => {
        Object.entries(res).forEach(([key, value]) => {
          console.log("Key: ", key, ", Value: ", value);
          const { roomId, ...rest } = value;
          tempRoomList.push({
            roomId: key,
            description: `This is room ${key}`,
            ...rest,
          });
        });
        setRoomList(tempRoomList);
      })
      .catch((err) => console.error(err));

    socket = io("https://choijungle.shop/mediasoup");
  }, []);

  return (
    <>
      <RoomListPageWrapper>
        <Banner />
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
