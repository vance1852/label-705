import { CanvasSize } from "../types";
import { GAME_CONFIG } from "../config";

export class BackgroundRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(canvasSize: CanvasSize): void {
    const ctx = this.ctx;
    const { width, height } = canvasSize;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#1e3a5f");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(
      0,
      height - GAME_CONFIG.FLOOR_HEIGHT,
      width,
      GAME_CONFIG.FLOOR_HEIGHT,
    );

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - GAME_CONFIG.FLOOR_HEIGHT);
    ctx.lineTo(width, height - GAME_CONFIG.FLOOR_HEIGHT);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(
      width * GAME_CONFIG.HOOP_X_RATIO,
      height - GAME_CONFIG.FLOOR_HEIGHT,
      120,
      Math.PI,
      0,
      true,
    );
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
