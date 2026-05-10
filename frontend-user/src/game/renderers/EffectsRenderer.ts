import { Particle, ScoreText, CanvasSize } from "../types";
import { GAME_CONFIG } from "../config";

export class EffectsRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawFlash(canvasSize: CanvasSize, intensity: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = `rgba(255, 220, 100, ${intensity * GAME_CONFIG.FLASH_ALPHA_MULTIPLIER})`;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
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
      ctx.fillStyle = "#22c55e";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  }
}
