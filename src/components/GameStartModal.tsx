import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { RoomData } from "../types/roomType";
import { NavLink } from "react-router-dom";

interface GameStartModalProps {
  roomInfo?: RoomData | null;
  show: boolean;
  winner?: string;
  onStartGame: () => void;
  handleBeforeUnload?: () => void;
}

export default function GameStartModal({
  show,
  onStartGame,
  handleBeforeUnload,
}: GameStartModalProps) {
  return (
    <Modal show={!show} centered animation={false}>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Start Game</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>게임을 시작하시겠습니다?</Modal.Body>
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
