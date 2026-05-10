import { Point } from "./types";
import { GAME_CONFIG } from "./config";
import { Ball } from "./Ball";

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
    this.rimRadius = GAME_CONFIG.HOOP_RIM_RADIUS;
    this.backboardWidth = GAME_CONFIG.HOOP_BACKBOARD_WIDTH;
    this.backboardHeight = GAME_CONFIG.HOOP_BACKBOARD_HEIGHT;
    this.netSegments = GAME_CONFIG.HOOP_NET_SEGMENTS;
    this.scored = false;
    this.lastBallY = 9999;
  }

  get leftRim(): Point {
    return { x: this.x - this.width / 2, y: this.y };
  }

  get rightRim(): Point {
    return { x: this.x + this.width / 2, y: this.y };
  }

  get backboard(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x + this.width / 2 + GAME_CONFIG.HOOP_BACKBOARD_OFFSET_X,
      y:
        this.y - this.backboardHeight / 2 + GAME_CONFIG.HOOP_BACKBOARD_Y_OFFSET,
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
      }, GAME_CONFIG.SCORE_COOLDOWN_MS);
      this.lastBallY = ball.y;
      return true;
    }

    this.lastBallY = ball.y;
    return false;
  }

  checkRimCollision(ball: Ball): void {
    const hoopLeft = this.x - this.width / 2 + GAME_CONFIG.RIM_INWARD_OFFSET;
    const hoopRight = this.x + this.width / 2 - GAME_CONFIG.RIM_INWARD_OFFSET;
    const inHoopX = ball.x > hoopLeft && ball.x < hoopRight;

    if (
      inHoopX &&
      ball.vy > 0 &&
      ball.y > this.y - ball.radius &&
      ball.y < this.y + GAME_CONFIG.RIM_PASS_THROUGH_DEPTH
    ) {
      return;
    }

    const rims = [this.leftRim, this.rightRim];

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
        ball.vx -= GAME_CONFIG.RIM_COLLISION_BOUNCE * dotProduct * nx;
        ball.vy -= GAME_CONFIG.RIM_COLLISION_BOUNCE * dotProduct * ny;

        ball.vx *= GAME_CONFIG.RIM_COLLISION_DAMPING;
        ball.vy *= GAME_CONFIG.RIM_COLLISION_DAMPING;

        ball.angularVelocity =
          ball.vx * GAME_CONFIG.RIM_COLLISION_ANGULAR_FACTOR;
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
        ball.vx *= GAME_CONFIG.BACKBOARD_BOUNCE_DAMPING;
        ball.angularVelocity = -ball.vy * GAME_CONFIG.BACKBOARD_ANGULAR_FACTOR;
      }
    }
  }

  reset(): void {
    this.scored = false;
    this.lastBallY = 9999;
  }
}
