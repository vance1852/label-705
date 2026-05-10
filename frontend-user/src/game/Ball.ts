import { GAME_CONFIG } from "./config";

export class Ball {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  rotation: number;
  angularVelocity: number;
  isResting: boolean;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
    this.angularVelocity = 0;
    this.isResting = true;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.angularVelocity;
    this.angularVelocity *= GAME_CONFIG.ANGULAR_VELOCITY_DECAY;
  }

  get speed(): number {
    return Math.hypot(this.vx, this.vy);
  }
}
