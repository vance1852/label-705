import { Point, DragState } from "./types";
import { Ball } from "./Ball";
import { GAME_CONFIG } from "./config";

export type ShotCallback = (vx: number, vy: number) => void;

export class InputManager {
  private canvas: HTMLCanvasElement;
  private drag: DragState;
  private ball: Ball | null = null;
  private onShot: ShotCallback | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.drag = {
      isDragging: false,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    };
    this.bindEvents();
  }

  setBall(ball: Ball): void {
    this.ball = ball;
  }

  setOnShot(callback: ShotCallback): void {
    this.onShot = callback;
  }

  getDrag(): DragState {
    return this.drag;
  }

  private getPointerPos(e: { clientX: number; clientY: number }): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private onPointerDown(e: { clientX: number; clientY: number }): void {
    if (!this.ball || !this.ball.isResting) return;

    const pos = this.getPointerPos(e);
    const dist = Math.hypot(pos.x - this.ball.x, pos.y - this.ball.y);

    if (
      dist <
      this.ball.radius * GAME_CONFIG.DRAG_DISTANCE_THRESHOLD_MULTIPLIER
    ) {
      this.drag.isDragging = true;
      this.drag.start = { x: this.ball.x, y: this.ball.y };
      this.drag.end = pos;
    }
  }

  private onPointerMove(e: { clientX: number; clientY: number }): void {
    if (!this.drag.isDragging) return;
    this.drag.end = this.getPointerPos(e);
  }

  private onPointerUp(): void {
    if (!this.drag.isDragging) return;

    this.drag.isDragging = false;

    const dx = this.drag.start.x - this.drag.end.x;
    const dy = this.drag.start.y - this.drag.end.y;
    const power = Math.min(
      Math.hypot(dx, dy) * GAME_CONFIG.POWER_SCALE,
      GAME_CONFIG.POWER_MAX,
    );

    if (power > GAME_CONFIG.POWER_MIN_THRESHOLD) {
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * power;
      const vy = Math.sin(angle) * power;
      this.onShot?.(vx, vy);
    }
  }

  private bindEvents(): void {
    this.canvas.addEventListener("mousedown", (e: MouseEvent) =>
      this.onPointerDown(e),
    );
    this.canvas.addEventListener("mousemove", (e: MouseEvent) =>
      this.onPointerMove(e),
    );
    this.canvas.addEventListener("mouseup", () => this.onPointerUp());
    this.canvas.addEventListener("mouseleave", () => this.onPointerUp());

    this.canvas.addEventListener("touchstart", (e: TouchEvent) => {
      e.preventDefault();
      this.onPointerDown(e.touches[0]);
    });
    this.canvas.addEventListener("touchmove", (e: TouchEvent) => {
      e.preventDefault();
      this.onPointerMove(e.touches[0]);
    });
    this.canvas.addEventListener("touchend", (e: TouchEvent) => {
      e.preventDefault();
      this.onPointerUp();
    });
  }
}
