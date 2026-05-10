import { BackgroundRenderer } from "./renderers/BackgroundRenderer";
import { BallRenderer } from "./renderers/BallRenderer";
import { HoopRenderer } from "./renderers/HoopRenderer";
import { EffectsRenderer } from "./renderers/EffectsRenderer";
import { Ball } from "./Ball";
import { Hoop } from "./Hoop";
import { Particle, ScoreText, Vector2D } from "./types";

export class Renderer {
  private backgroundRenderer: BackgroundRenderer;
  private ballRenderer: BallRenderer;
  private hoopRenderer: HoopRenderer;
  private effectsRenderer: EffectsRenderer;

  constructor(ctx: CanvasRenderingContext2D) {
    this.backgroundRenderer = new BackgroundRenderer(ctx);
    this.ballRenderer = new BallRenderer(ctx);
    this.hoopRenderer = new HoopRenderer(ctx);
    this.effectsRenderer = new EffectsRenderer(ctx);
  }

  clear(width: number, height: number): void {
    this.backgroundRenderer.clear(width, height);
  }

  drawBackground(width: number, height: number): void {
    this.backgroundRenderer.drawBackground(width, height);
  }

  drawFlash(width: number, height: number, intensity: number): void {
    this.backgroundRenderer.drawFlash(width, height, intensity);
  }

  drawBall(ball: Ball): void {
    this.ballRenderer.drawBall(ball);
  }

  drawHoop(hoop: Hoop): void {
    this.hoopRenderer.drawHoop(hoop);
  }

  drawParticles(particles: Particle[]): void {
    this.effectsRenderer.drawParticles(particles);
  }

  drawScoreTexts(scoreTexts: ScoreText[]): void {
    this.effectsRenderer.drawScoreTexts(scoreTexts);
  }

  drawTrajectory(start: Vector2D, end: Vector2D, ballRadius: number): void {
    this.effectsRenderer.drawTrajectory(start, end, ballRadius);
  }
}
