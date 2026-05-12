import { CONFIG } from "../config";
import type { Vector2 } from "../types";

export class TrajectoryRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawTrajectory(start: Vector2, end: Vector2, ballRadius: number): void {
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
      Math.hypot(dx, dy) * CONFIG.input.powerMultiplier,
      CONFIG.input.maxPower,
    );
    const angle = Math.atan2(dy, dx);

    let vx = Math.cos(angle) * power;
    let vy = Math.sin(angle) * power;
    let x = start.x;
    let y = start.y;

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < CONFIG.trajectory.points; i++) {
      vy += CONFIG.physics.gravity;
      x += vx;
      y += vy;

      if (y > ctx.canvas.height - CONFIG.canvas.floorHeight - ballRadius) break;

      const size = Math.max(2, CONFIG.trajectory.baseSize - i * CONFIG.trajectory.sizeDecay);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const powerPercent = Math.min(power / CONFIG.input.maxPower, 1);
    const barW = CONFIG.trajectory.powerBarWidth;
    const barH = CONFIG.trajectory.powerBarHeight;
    const barX = start.x - barW / 2;
    const barY = start.y + CONFIG.trajectory.powerBarYOffset;

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
