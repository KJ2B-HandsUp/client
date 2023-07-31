export const START_GAME = "START_GAME";
export const CLICK_BLOCK = "CLICK_BLOCK";
export const CHANGE_TURN = "CHANGE_TURN";
export const ADD_PLAYER = "ADD_PLAYER";

export const CAMERA_VIEW_WIDTH = "500rem";
export const CAMERA_VIEW_HEIGHT = "500rem";

export type UserType = {
  id: number;
  name: string;
  stream?: MediaStream;
};

export type MediaDataType = {
  producerId: string;
  mediaStream: MediaStream;
};

export type BlockType = {
  row: number;
  column: number;
};

export type StateType = {
  started: boolean;
  playersNum: number;
  turn: number;
  endTurn: boolean;
  blockNum: number;
  blockList: BlockType[];
  prevBlockList: BlockType[];
  winner: number;
};

export type ActionType =
  | { type: "START_GAME" }
  | { type: "CLICK_BLOCK"; clickedBlock: BlockType; userId: number }
  | { type: "ADD_PLAYER"; num: number }
  | { type: "CHANGE_TURN" };

export type GameDispatch = {
  started: boolean;
  dispatch: (action: ActionType) => void;
};
