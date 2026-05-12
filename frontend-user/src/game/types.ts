export interface Vector2 {
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

export interface Rim {
  x: number;
  y: number;
}

export interface Backboard {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScoreData {
  score: number;
  streak: number;
  bestStreak: number;
  points: number;
}

export type GameEvent =
  | "score"
  | "scoreUpdate"
  | "ballReset"
  | "shoot"
  | "gameReset";

export interface DragState {
  isDragging: boolean;
  dragStart: Vector2;
  dragEnd: Vector2;
}
