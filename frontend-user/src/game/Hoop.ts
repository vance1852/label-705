import { CONFIG } from "./config";
import { Ball } from "./Ball";
import type { Rim, Backboard } from "./types";

export class Hoop {
  x: number;
  y: number;
  width: number;
  height: number;
  rimRadius: number;
  backboardWidth: number;
  backboardHeight: number;
  netSegments: number;
  scored: boolean;
  lastBallY: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rimRadius = CONFIG.hoop.rimRadius;
    this.backboardWidth = CONFIG.hoop.backboardWidth;
    this.backboardHeight = CONFIG.hoop.backboardHeight;
    this.netSegments = CONFIG.hoop.netSegments;
    this.scored = false;
    this.lastBallY = 9999;
  }

  get leftRim(): Rim {
    return { x: this.x - this.width / 2, y: this.y };
  }

  get rightRim(): Rim {
    return { x: this.x + this.width / 2, y: this.y };
  }

  get backboard(): Backboard {
    return {
      x: this.x + this.width / 2 + 15,
      y: this.y - this.backboardHeight / 2 + 10,
      width: this.backboardWidth,
      height: this.backboardHeight,
    };
  }

  checkScore(ball: Ball): boolean {
    const hoopLeft = this.x - this.width / 2;
    const hoopRight = this.x + this.width / 2;
    const inHoopX = ball.x > hoopLeft && ball.x < hoopRight;

    const wasAbove = this.lastBallY < this.y;
    const nowBelow = ball.y >= this.y;

    if (wasAbove && nowBelow && inHoopX && ball.vy > 0 && !this.scored) {
      this.scored = true;
      setTimeout(() => {
        this.scored = false;
      }, CONFIG.hoop.scoreTimeout);
      this.lastBallY = ball.y;
      return true;
    }

    this.lastBallY = ball.y;
    return false;
  }

  checkRimCollision(ball: Ball): void {
    const hoopLeft = this.x - this.width / 2 + 3;
    const hoopRight = this.x + this.width / 2 - 3;
    const inHoopX = ball.x > hoopLeft && ball.x < hoopRight;

    if (
      inHoopX &&
      ball.vy > 0 &&
      ball.y > this.y - ball.radius &&
      ball.y < this.y + 30
    ) {
      return;
    }

    const rims: Rim[] = [this.leftRim, this.rightRim];

    for (const rim of rims) {
      const dx = ball.x - rim.x;
      const dy = ball.y - rim.y;
      const dist = Math.hypot(dx, dy);
      const minDist = ball.radius + this.rimRadius;

      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        ball.x += nx * overlap;
        ball.y += ny * overlap;

        const dotProduct = ball.vx * nx + ball.vy * ny;
        ball.vx -= CONFIG.collision.rimRestitution * dotProduct * nx;
        ball.vy -= CONFIG.collision.rimRestitution * dotProduct * ny;

        ball.vx *= CONFIG.collision.rimFriction;
        ball.vy *= CONFIG.collision.rimFriction;

        ball.angularVelocity = ball.vx * 0.05;
      }
    }
  }

  checkBackboardCollision(ball: Ball): void {
    const bb = this.backboard;

    if (
      ball.x + ball.radius > bb.x &&
      ball.x - ball.radius < bb.x + bb.width &&
      ball.y + ball.radius > bb.y &&
      ball.y - ball.radius < bb.y + bb.height
    ) {
      if (ball.vx > 0) {
        ball.x = bb.x - ball.radius;
        ball.vx *= CONFIG.collision.backboardBounce;
        ball.angularVelocity = -ball.vy * 0.03;
      }
    }
  }

  reset(): void {
    this.scored = false;
    this.lastBallY = 9999;
  }
}
