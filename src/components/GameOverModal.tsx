import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { memo } from "react";
import { GameModalProps } from "../types/game.type";

function GameOverModal({
  show,
  winner,
  onStartGame,
  handleBeforeUnload,
}: GameModalProps) {
  return (
    <Modal show={show} centered animation={false}>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Game Over</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Winner: {winner}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={onStartGame}>
          New Game
        </Button>

        <NavLink
          to={`/main/roomlist`}
          style={{ color: "white", textDecoration: "none" }}
          onClick={handleBeforeUnload}
        >
          <Button>Go Home</Button>
        </NavLink>
      </Modal.Footer>
    </Modal>
  );
}

export const MemoizedGameOverModal = memo(GameOverModal);
