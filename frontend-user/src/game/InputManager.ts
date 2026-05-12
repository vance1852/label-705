import { CONFIG } from "./config";
import { Ball } from "./Ball";
import type { Vector2, DragState } from "./types";

export class InputManager {
  private canvas: HTMLCanvasElement;
  private ball: Ball;
  private dragState: DragState;
  private onShootCallback: ((vx: number, vy: number) => void) | null;

  constructor(canvas: HTMLCanvasElement, ball: Ball) {
    this.canvas = canvas;
    this.ball = ball;
    this.dragState = {
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      dragEnd: { x: 0, y: 0 },
    };
    this.onShootCallback = null;
    this.bindEvents();
  }

  getDragState(): DragState {
    return this.dragState;
  }

  setOnShoot(callback: (vx: number, vy: number) => void): void {
    this.onShootCallback = callback;
  }

  private bindEvents(): void {
    this.canvas.addEventListener("mousedown", (e) => this.onPointerDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onPointerMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.onPointerUp(e));
    this.canvas.addEventListener("mouseleave", (e) => this.onPointerUp(e));

    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.onPointerDown(e.touches[0]);
    });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      this.onPointerMove(e.touches[0]);
    });
    this.canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.onPointerUp(e.changedTouches[0]);
    });
  }

  private getPointerPos(e: MouseEvent | Touch): Vector2 {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private onPointerDown(e: MouseEvent | Touch): void {
    if (!this.ball.isResting) return;

    const pos = this.getPointerPos(e);
    const dist = Math.hypot(pos.x - this.ball.x, pos.y - this.ball.y);

    if (dist < this.ball.radius * CONFIG.input.dragRadiusMultiplier) {
      this.dragState.isDragging = true;
      this.dragState.dragStart = { x: this.ball.x, y: this.ball.y };
      this.dragState.dragEnd = pos;
    }
  }

  private onPointerMove(e: MouseEvent | Touch): void {
    if (!this.dragState.isDragging) return;
    this.dragState.dragEnd = this.getPointerPos(e);
  }

  private onPointerUp(_e: MouseEvent | Touch): void {
    if (!this.dragState.isDragging) return;

    this.dragState.isDragging = false;

    const dx = this.dragState.dragStart.x - this.dragState.dragEnd.x;
    const dy = this.dragState.dragStart.y - this.dragState.dragEnd.y;
    const power = Math.min(
      Math.hypot(dx, dy) * CONFIG.input.powerMultiplier,
      CONFIG.input.maxPower,
    );

    if (power > CONFIG.input.minPower) {
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * power;
      const vy = Math.sin(angle) * power;

      if (this.onShootCallback) {
        this.onShootCallback(vx, vy);
      }
    }
  }

  reset(): void {
    this.dragState = {
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      dragEnd: { x: 0, y: 0 },
    };
  }

  destroy(): void {
    this.onShootCallback = null;
  }
}
