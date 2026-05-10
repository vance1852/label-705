import { CanvasSize, DragState } from "./types";
import { Ball } from "./Ball";
import { Hoop } from "./Hoop";
import { EffectsManager } from "./EffectsManager";
import { BackgroundRenderer } from "./renderers/BackgroundRenderer";
import { BallRenderer } from "./renderers/BallRenderer";
import { HoopRenderer } from "./renderers/HoopRenderer";
import { EffectsRenderer } from "./renderers/EffectsRenderer";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private backgroundRenderer: BackgroundRenderer;
  private ballRenderer: BallRenderer;
  private hoopRenderer: HoopRenderer;
  private effectsRenderer: EffectsRenderer;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.backgroundRenderer = new BackgroundRenderer(ctx);
    this.ballRenderer = new BallRenderer(ctx);
    this.hoopRenderer = new HoopRenderer(ctx);
    this.effectsRenderer = new EffectsRenderer(ctx);
  }

  clear(canvasSize: CanvasSize): void {
    this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  render(
    canvasSize: CanvasSize,
    ball: Ball,
    hoop: Hoop,
    effects: EffectsManager,
    drag: DragState | null,
  ): void {
    this.clear(canvasSize);
    this.backgroundRenderer.draw(canvasSize);

    if (effects.flashIntensity > 0) {
      this.effectsRenderer.drawFlash(canvasSize, effects.flashIntensity);
    }

    this.hoopRenderer.draw(hoop);
    this.ballRenderer.draw(ball);
    this.effectsRenderer.drawParticles(effects.particles);
    this.effectsRenderer.drawScoreTexts(effects.scoreTexts);

    if (drag && drag.isDragging) {
      this.ballRenderer.drawTrajectory(
        drag.start,
        drag.end,
        ball.radius,
        canvasSize.height,
      );
    }
  }
}
