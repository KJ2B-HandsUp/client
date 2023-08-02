import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { RoomData } from "../types/roomType";

interface ModalProps {
  roomInfo: RoomData | null;
  show: boolean;
  onHide: () => void;
}

let roomMode = "game";

export default function RoomJoinModal({ roomInfo, show, onHide }: ModalProps) {
  console.log("roomjoinmodal rendered");
  if (roomInfo && roomInfo.roomId.toLowerCase().includes("solo")) {
    roomMode = "sologame";
    console.log("solo mode!!");
  }
  return (
    <Modal onHide={onHide} show={show} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>{roomInfo?.roomId} 에 입장하시겠습니까?</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{roomInfo?.description}</Modal.Body>
      <Modal.Footer>
        <Button>
          <NavLink
            to={`/${roomMode}/${roomInfo?.roomId}`}
            style={{ color: "white" }}
          >
            Join
          </NavLink>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
