import { Particle, ScoreText, Vector2D } from "../types";
import { COLORS, GAME, UI } from "../config";

export class EffectsRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawParticles(particles: Particle[]): void {
    const ctx = this.ctx;

    for (const p of particles) {
      ctx.globalAlpha = Math.min(p.life, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * Math.min(p.life, 1), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawScoreTexts(scoreTexts: ScoreText[]): void {
    const ctx = this.ctx;

    for (const t of scoreTexts) {
      ctx.save();
      ctx.globalAlpha = Math.min(t.life, 1);
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = COLORS.scoreText;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  }

  drawTrajectory(start: Vector2D, end: Vector2D, ballRadius: number): void {
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
    const power = Math.min(Math.hypot(dx, dy) * GAME.shotPowerMultiplier, GAME.maxPower);
    const angle = Math.atan2(dy, dx);

    let vx = Math.cos(angle) * power;
    let vy = Math.sin(angle) * power;
    let x = start.x;
    let y = start.y;

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < UI.trajectoryPoints; i++) {
      vy += 0.5;
      x += vx;
      y += vy;

      if (y > ctx.canvas.height - GAME.floorHeight - ballRadius) break;

      const size = Math.max(2, UI.trajectoryBaseSize - i * UI.trajectorySizeDecay);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const powerPercent = Math.min(power / GAME.maxPower, 1);
    const barW = UI.powerBarWidth;
    const barH = UI.powerBarHeight;
    const barX = start.x - barW / 2;
    const barY = start.y + UI.powerBarOffsetY;

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
