export interface Router {
  _events: Events;
  _eventsCount: number;
  _maxListeners: null;
}

export interface Events {
  [key: string]: any;
}

export interface RoomData {
  roomId: string;
  router?: Router;
  peers?: string[];
  peersNum?: number;
  roomType?: string;
  description?: string;
}

export interface RoomList {
  [key: string]: RoomData;
}
