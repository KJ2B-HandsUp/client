import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { RoomData } from "../types/roomType";

interface GameOverModalProps {
  roomInfo?: RoomData | null;
  show: boolean;
  winner: string;

  onStartGame: () => void;
  handleBeforeUnload: () => void;
}

export default function GameOverModal({
  show,
  winner,
  onStartGame,
  handleBeforeUnload,
}: GameOverModalProps) {
  return (
    <Modal show={show} centered animation={false}>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Game Over</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Winner: ${winner}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={onStartGame}>
          New Game
        </Button>
        <Button>
          <NavLink
            to={`/home/roomlist`}
            style={{ color: "white" }}
            onClick={handleBeforeUnload}
          >
            Go Home
          </NavLink>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
