import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { memo } from "react";
import { GameModalProps } from "../types/game.type";

function GameStartModal({
  show,
  onStartGame,
  handleBeforeUnload,
}: GameModalProps) {
  return (
    <Modal show={!show} centered animation={false}>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Start Game</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        게임을 시작하시겠습니까?
        <br />
        <br />
        <p>Tip: F11을 누르시면 쾌적한 환경에서 플레이하실 수 있습니다:)</p>
      </Modal.Body>
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

export const MemoizedGameStartModal = memo(GameStartModal);
