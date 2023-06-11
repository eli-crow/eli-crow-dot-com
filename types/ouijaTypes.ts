export interface Stroke {
  points: { position: [x: number, y: number]; time: number }[];
}

export interface ClientToServerEvents {
  stroke: (stroke: Stroke) => void;
  clear: () => void;
}

export interface ServerToClientEvents {
  stroked: (stroke: Stroke) => void;
  cleared: () => void;
}
