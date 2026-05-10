import { EventEmitter } from "./EventEmitter";
import { Vector2D, DragState } from "./types";
import { GAME } from "./config";

export interface BallRef {
  x: number;
  y: number;
  radius: number;
  isResting: boolean;
  vx: number;
  vy: number;
}

export type PointerEventLike = {
  clientX: number;
  clientY: number;
};

export class InputManager {
  private canvas: HTMLCanvasElement;
  private emitter: EventEmitter;
  private getBall: () => BallRef | null;
  private dragState: DragState;

  constructor(
    canvas: HTMLCanvasElement,
    emitter: EventEmitter,
    getBall: () => BallRef | null,
  ) {
    this.canvas = canvas;
    this.emitter = emitter;
    this.getBall = getBall;
    this.dragState = {
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      dragEnd: { x: 0, y: 0 },
    };
  }

  getDragState(): DragState {
    return { ...this.dragState };
  }

  bindEvents(): void {
    window.addEventListener("resize", () => {
      this.emitter.emit("resize");
    });

    this.canvas.addEventListener("mousedown", (e) =>
      this.onPointerDown({ clientX: e.clientX, clientY: e.clientY }),
    );
    this.canvas.addEventListener("mousemove", (e) =>
      this.onPointerMove({ clientX: e.clientX, clientY: e.clientY }),
    );
    this.canvas.addEventListener("mouseup", (e) =>
      this.onPointerUp({ clientX: e.clientX, clientY: e.clientY }),
    );
    this.canvas.addEventListener("mouseleave", (e) =>
      this.onPointerUp({ clientX: e.clientX, clientY: e.clientY }),
    );

    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onPointerDown({ clientX: touch.clientX, clientY: touch.clientY });
    });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onPointerMove({ clientX: touch.clientX, clientY: touch.clientY });
    });
    this.canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.onPointerUp({ clientX: touch.clientX, clientY: touch.clientY });
    });
  }

  private getPointerPos(e: PointerEventLike): Vector2D {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private onPointerDown(e: PointerEventLike): void {
    const ball = this.getBall();
    if (!ball || !ball.isResting) return;

    const pos = this.getPointerPos(e);
    const dist = Math.hypot(pos.x - ball.x, pos.y - ball.y);

    if (dist < ball.radius * GAME.dragDistanceThreshold) {
      this.dragState.isDragging = true;
      this.dragState.dragStart = { x: ball.x, y: ball.y };
      this.dragState.dragEnd = pos;
    }
  }

  private onPointerMove(e: PointerEventLike): void {
    if (!this.dragState.isDragging) return;
    this.dragState.dragEnd = this.getPointerPos(e);
  }

  private onPointerUp(_e: PointerEventLike): void {
    if (!this.dragState.isDragging) return;

    const ball = this.getBall();
    if (!ball) {
      this.dragState.isDragging = false;
      return;
    }

    this.dragState.isDragging = false;

    const dx = this.dragState.dragStart.x - this.dragState.dragEnd.x;
    const dy = this.dragState.dragStart.y - this.dragState.dragEnd.y;
    const power = Math.min(
      Math.hypot(dx, dy) * GAME.shotPowerMultiplier,
      GAME.maxPower,
    );

    if (power > GAME.minPower) {
      const angle = Math.atan2(dy, dx);
      ball.vx = Math.cos(angle) * power;
      ball.vy = Math.sin(angle) * power;
      ball.isResting = false;
      this.emitter.emit("shotFired");
    }
  }
}
