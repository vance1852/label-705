import { Ball } from "./Ball";
import { CanvasSize } from "./types";
import { GAME_CONFIG } from "./config";

export class Physics {
  private gravity: number;
  private airResistance: number;

  constructor() {
    this.gravity = GAME_CONFIG.GRAVITY;
    this.airResistance = GAME_CONFIG.AIR_RESISTANCE;
  }

  applyGravity(ball: Ball): void {
    ball.vy += this.gravity;
  }

  applyAirResistance(ball: Ball): void {
    ball.vx *= this.airResistance;
    ball.vy *= this.airResistance;
  }

  checkBoundaries(ball: Ball, canvasSize: CanvasSize): boolean {
    let shouldReset = false;

    if (ball.y + ball.radius > canvasSize.height - GAME_CONFIG.FLOOR_HEIGHT) {
      ball.y = canvasSize.height - GAME_CONFIG.FLOOR_HEIGHT - ball.radius;
      ball.vy *= GAME_CONFIG.FLOOR_BOUNCE_Y_DAMPING;
      ball.vx *= GAME_CONFIG.FLOOR_BOUNCE_X_DAMPING;

      if (
        Math.abs(ball.vy) < GAME_CONFIG.REST_VY_THRESHOLD &&
        Math.abs(ball.vx) < GAME_CONFIG.REST_VX_THRESHOLD
      ) {
        shouldReset = true;
      }
    }

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx *= GAME_CONFIG.WALL_BOUNCE_DAMPING;
    }
    if (ball.x + ball.radius > canvasSize.width) {
      ball.x = canvasSize.width - ball.radius;
      ball.vx *= GAME_CONFIG.WALL_BOUNCE_DAMPING;
    }

    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy *= GAME_CONFIG.CEILING_BOUNCE_DAMPING;
    }

    return shouldReset;
  }
}
