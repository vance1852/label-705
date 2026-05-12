import { Hoop } from "../Hoop";

export class HoopRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawHoop(hoop: Hoop): void {
    const ctx = this.ctx;

    const bb = hoop.backboard;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(bb.x, bb.y, bb.width, bb.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(bb.x, bb.y, bb.width, bb.height);

    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 3;
    ctx.strokeRect(bb.x - 32, hoop.y - 22, 32, 28);

    ctx.fillStyle = "#4a5568";
    ctx.fillRect(bb.x + bb.width, bb.y + bb.height - 15, 6, 180);

    this.drawNet(hoop);

    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(hoop.leftRim.x, hoop.leftRim.y);
    ctx.lineTo(hoop.rightRim.x, hoop.rightRim.y);
    ctx.stroke();

    ctx.fillStyle = "#e11d48";
    ctx.beginPath();
    ctx.arc(hoop.leftRim.x, hoop.leftRim.y, hoop.rimRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hoop.rightRim.x, hoop.rightRim.y, hoop.rimRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawNet(hoop: Hoop): void {
    const ctx = this.ctx;
    const netDepth = hoop.height;
    const segments = hoop.netSegments;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1.5;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const topX = hoop.leftRim.x + (hoop.rightRim.x - hoop.leftRim.x) * t;
      const bottomX = hoop.x + (t - 0.5) * hoop.width * 0.4;

      ctx.beginPath();
      ctx.moveTo(topX, hoop.y);
      ctx.quadraticCurveTo(
        (topX + bottomX) / 2,
        hoop.y + netDepth * 0.6,
        bottomX,
        hoop.y + netDepth,
      );
      ctx.stroke();
    }

    for (let j = 1; j <= 4; j++) {
      const y = hoop.y + (netDepth * j) / 5;
      const shrink = (j / 5) * 0.3;

      ctx.beginPath();
      ctx.moveTo(hoop.leftRim.x + hoop.width * shrink, y);
      ctx.lineTo(hoop.rightRim.x - hoop.width * shrink, y);
      ctx.stroke();
    }
  }
}
