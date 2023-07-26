import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { RoomData } from "../types/roomType";

interface ModalProps {
  roomInfo: RoomData | null;
  show: boolean;
  onHide: () => void;
}

export default function RoomJoinModal({ roomInfo, show, onHide }: ModalProps) {
  return (
    <Modal onHide={onHide} show={show} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>{roomInfo?.roomId} 에 입장하시겠습니까?</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>{roomInfo?.description}</h3>
      </Modal.Body>
      <Modal.Footer>
        <Button>
          <NavLink to={`/game/${roomInfo?.roomId}`}>Join</NavLink>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
