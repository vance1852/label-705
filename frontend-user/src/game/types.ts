export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export interface ScoreText {
  x: number;
  y: number;
  text: string;
  life: number;
}

export interface DragState {
  isDragging: boolean;
  start: Point;
  end: Point;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface ScorePayload {
  score: number;
  streak: number;
  bestStreak: number;
}

export type GameEvents = {
  score: ScorePayload;
  shotFired: void;
  ballReset: void;
  miss: void;
};
