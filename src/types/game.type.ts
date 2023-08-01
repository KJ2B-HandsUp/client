export const START_GAME = "START_GAME";
export const CLICK_BLOCK = "CLICK_BLOCK";
export const CHANGE_TURN = "CHANGE_TURN";
export const ADD_PLAYER = "ADD_PLAYER";
export const OTHER_PLAYER_CLICK = "OTHER_PLAYER_CLICK";
export const OTHER_CHANGE_TURN = "OTHER_CHANGE_TURN";

export const CAMERA_VIEW_WIDTH = "500rem";
export const CAMERA_VIEW_HEIGHT = "500rem";

export type TransferDataType = {
  type: string;
  data?: object;
};

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
  rowIndex: number;
  colIndex: number;
};

export type StateType = {
  start: boolean;
  end: boolean;
  playersNum: number;
  turn: number;
  endTurn: boolean;
  blockNum: number;
  blockList: BlockType[];
  prevBlockList: BlockType[];
  winner: number;
  trigerClick: boolean;
  clickedBlock: BlockType;
};

export type ActionType =
  | { type: "START_GAME" }
  | { type: "CLICK_BLOCK"; userId: number; clickedBlock: BlockType }
  | { type: "ADD_PLAYER"; num: number }
  | { type: "CHANGE_TURN" }
  | { type: "OTHER_PLAYER_CLICK"; userId: number; clickedBlock: BlockType }
  | { type: "OTHER_CHANGE_TURN" };

export type GameDispatch = {
  started: boolean;
  dispatch: (action: ActionType) => void;
  trigerClick: boolean;
  clickedBlock: BlockType;
};
