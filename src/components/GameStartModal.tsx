import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { RoomData } from "../types/roomType";

interface ModalProps {
  roomInfo: RoomData | null;
  show: boolean;
  winner: string;
  onHide: () => void;
}

export default function GameStartModal({
  roomInfo,
  show,
  winner,
  onHide,
}: ModalProps) {
  return (
    <Modal onHide={onHide} show={show} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>게임 종료</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Winner: ${winner}</Modal.Body>
      <Modal.Footer>
        <Button>
          <NavLink to={`/game/${roomInfo?.roomId}`}>Join</NavLink>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
