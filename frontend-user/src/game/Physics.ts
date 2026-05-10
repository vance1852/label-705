import { Ball } from "./Ball";
import { PHYSICS, COLLISION, GAME } from "./config";

export interface BoundaryCheckResult {
  shouldReset: boolean;
}

export class Physics {
  gravity: number;
  airResistance: number;

  constructor() {
    this.gravity = PHYSICS.gravity;
    this.airResistance = PHYSICS.airResistance;
  }

  applyGravity(ball: Ball): void {
    ball.vy += this.gravity;
  }

  applyAirResistance(ball: Ball): void {
    ball.vx *= this.airResistance;
    ball.vy *= this.airResistance;
  }

  checkBoundaries(ball: Ball, canvasWidth: number, canvasHeight: number): BoundaryCheckResult {
    let shouldReset = false;
    const floorY = canvasHeight - GAME.floorHeight;

    if (ball.y + ball.radius > floorY) {
      ball.y = floorY - ball.radius;
      ball.vy *= -COLLISION.floorBounceY;
      ball.vx *= COLLISION.floorBounceX;

      if (
        Math.abs(ball.vy) < COLLISION.restingThresholdVy &&
        Math.abs(ball.vx) < COLLISION.restingThresholdVx
      ) {
        shouldReset = true;
      }
    }

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx *= -COLLISION.wallBounce;
    }

    if (ball.x + ball.radius > canvasWidth) {
      ball.x = canvasWidth - ball.radius;
      ball.vx *= -COLLISION.wallBounce;
    }

    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy *= -COLLISION.ceilingBounce;
    }

    return { shouldReset };
  }
}
