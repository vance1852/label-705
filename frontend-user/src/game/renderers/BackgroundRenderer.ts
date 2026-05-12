import { CONFIG } from "../config";

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
    gradient.addColorStop(0, "#1e3a5f");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(0, height - CONFIG.canvas.floorHeight, width, CONFIG.canvas.floorHeight);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - CONFIG.canvas.floorHeight);
    ctx.lineTo(width, height - CONFIG.canvas.floorHeight);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(
      width * CONFIG.hoop.x,
      height - CONFIG.canvas.floorHeight,
      120,
      Math.PI,
      0,
      true,
    );
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawFlash(width: number, height: number, intensity: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = `rgba(255, 220, 100, ${intensity * CONFIG.effects.flash.alphaMultiplier})`;
    ctx.fillRect(0, 0, width, height);
  }
}
