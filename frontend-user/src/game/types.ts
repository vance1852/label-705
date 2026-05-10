export interface Vector2D {
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

export interface ScoreData {
  score: number;
  streak: number;
  bestStreak: number;
}

export interface DragState {
  isDragging: boolean;
  dragStart: Vector2D;
  dragEnd: Vector2D;
}

export interface Backboard {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}
