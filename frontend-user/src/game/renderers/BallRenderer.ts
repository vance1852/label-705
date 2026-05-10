import { Ball } from "../Ball";
import { Point } from "../types";
import { GAME_CONFIG } from "../config";

export class BallRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(ball: Ball): void {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(3, 3, ball.radius, ball.radius * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    const gradient = ctx.createRadialGradient(
      -ball.radius * 0.3,
      -ball.radius * 0.3,
      0,
      0,
      0,
      ball.radius,
    );
    gradient.addColorStop(0, "#ff8c42");
    gradient.addColorStop(0.5, "#f97316");
    gradient.addColorStop(1, "#c2410c");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-ball.radius, 0);
    ctx.lineTo(ball.radius, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -ball.radius);
    ctx.lineTo(0, ball.radius);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, ball.radius * 0.6, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, ball.radius * 0.6, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();
  }

  drawTrajectory(
    start: Point,
    end: Point,
    ballRadius: number,
    canvasHeight: number,
  ): void {
    const ctx = this.ctx;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);

    const dx = start.x - end.x;
    const dy = start.y - end.y;
    const power = Math.min(
      Math.hypot(dx, dy) * GAME_CONFIG.POWER_SCALE,
      GAME_CONFIG.POWER_MAX,
    );
    const angle = Math.atan2(dy, dx);

    let vx = Math.cos(angle) * power;
    let vy = Math.sin(angle) * power;
    let x = start.x;
    let y = start.y;

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < GAME_CONFIG.TRAJECTORY_DOTS; i++) {
      vy += GAME_CONFIG.GRAVITY;
      x += vx;
      y += vy;

      if (y > canvasHeight - GAME_CONFIG.FLOOR_HEIGHT - ballRadius) break;

      const size = Math.max(
        GAME_CONFIG.TRAJECTORY_DOT_MIN_SIZE,
        GAME_CONFIG.TRAJECTORY_DOT_START_SIZE -
          i * GAME_CONFIG.TRAJECTORY_DOT_SIZE_DECAY,
      );
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const powerPercent = Math.min(power / GAME_CONFIG.POWER_MAX, 1);
    const barW = GAME_CONFIG.POWER_BAR_WIDTH;
    const barH = GAME_CONFIG.POWER_BAR_HEIGHT;
    const barX = start.x - barW / 2;
    const barY = start.y + GAME_CONFIG.POWER_BAR_OFFSET_Y;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, barY, barW, barH);

    const powerGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    powerGrad.addColorStop(0, "#22c55e");
    powerGrad.addColorStop(0.5, "#eab308");
    powerGrad.addColorStop(1, "#ef4444");

    ctx.fillStyle = powerGrad;
    ctx.fillRect(barX, barY, barW * powerPercent, barH);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
  }
}
