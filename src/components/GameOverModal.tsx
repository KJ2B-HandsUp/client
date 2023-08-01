import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { RoomData } from "../types/roomType";

interface ModalProps {
  roomInfo?: RoomData | null;
  show: boolean;
  winner: string;

  onStartGame: () => void;
}

export default function GameOverModal({
  show,
  winner,
  onStartGame,
}: ModalProps) {
  return (
    <Modal show={show} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Game Over</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Winner: ${winner}</Modal.Body>
      <Modal.Footer>
        <Button>
          <NavLink to={`/home/roomlist`}>Go Home</NavLink>
        </Button>
        <Button onClick={onStartGame}>New Game</Button>
      </Modal.Footer>
    </Modal>
  );
}
