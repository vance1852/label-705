import { COLORS, GAME, EFFECTS } from "../config";

export class BackgroundRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear(width: number, height: number): void {
    this.ctx.clearRect(0, 0, width, height);
  }

  drawBackground(width: number, height: number): void {
    const ctx = this.ctx;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, COLORS.backgroundTop);
    gradient.addColorStop(1, COLORS.backgroundBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(0, height - GAME.floorHeight, width, GAME.floorHeight);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - GAME.floorHeight);
    ctx.lineTo(width, height - GAME.floorHeight);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(width * 0.78, height - GAME.floorHeight, 120, Math.PI, 0, true);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawFlash(width: number, height: number, intensity: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = `${COLORS.flash}${intensity * EFFECTS.flashIntensity})`;
    ctx.fillRect(0, 0, width, height);
  }
}

