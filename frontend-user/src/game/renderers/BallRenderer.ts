import { Ball } from "../Ball";

export class BallRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawBall(ball: Ball): void {
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
}
