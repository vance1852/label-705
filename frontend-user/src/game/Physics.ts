import { CONFIG } from "./config";
import { Ball } from "./Ball";

export interface BoundaryResult {
  shouldResetBall: boolean;
}

export class Physics {
  gravity: number;
  airResistance: number;

  constructor() {
    this.gravity = CONFIG.physics.gravity;
    this.airResistance = CONFIG.physics.airResistance;
  }

  applyGravity(ball: Ball): void {
    ball.vy += this.gravity;
  }

  applyAirResistance(ball: Ball): void {
    ball.vx *= this.airResistance;
    ball.vy *= this.airResistance;
  }

  checkBoundaries(
    ball: Ball,
    canvasWidth: number,
    canvasHeight: number,
  ): BoundaryResult {
    let shouldResetBall = false;
    const floorY = canvasHeight - CONFIG.canvas.floorHeight;

    if (ball.y + ball.radius > floorY) {
      ball.y = floorY - ball.radius;
      ball.vy *= CONFIG.collision.floorBounce;
      ball.vx *= CONFIG.collision.floorFriction;

      if (
        Math.abs(ball.vy) < CONFIG.collision.minVyToRest &&
        Math.abs(ball.vx) < CONFIG.collision.minVxToRest
      ) {
        shouldResetBall = true;
      }
    }

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx *= CONFIG.collision.wallBounce;
    }

    if (ball.x + ball.radius > canvasWidth) {
      ball.x = canvasWidth - ball.radius;
      ball.vx *= CONFIG.collision.wallBounce;
    }

    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy *= CONFIG.collision.ceilingBounce;
    }

    return { shouldResetBall };
  }
}
