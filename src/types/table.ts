import { RefObject } from "react";

export interface GameProps {
  ref?: RefObject<HTMLVideoElement>;
  turn?: number;
  userId?: number;
  row: number;
  column: number;
}
