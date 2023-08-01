import { RefObject } from "react";

export interface TableProps {
  turn?: number;
  id: number;
  row: number;
  column: number;
}

export interface GameProps {
  ref: RefObject<HTMLVideoElement>;
  turn: number;
  id: number;
  row: number;
  column: number;
}
