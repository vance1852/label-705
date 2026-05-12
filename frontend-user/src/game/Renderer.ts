import { Ball } from "./Ball";
import { Hoop } from "./Hoop";
import { BackgroundRenderer } from "./renderers/BackgroundRenderer";
import { BallRenderer } from "./renderers/BallRenderer";
import { HoopRenderer } from "./renderers/HoopRenderer";
import { EffectsRenderer } from "./renderers/EffectsRenderer";
import { TrajectoryRenderer } from "./renderers/TrajectoryRenderer";
import type { Vector2, Particle, ScoreText } from "./types";

export class Renderer {
  private backgroundRenderer: BackgroundRenderer;
  private ballRenderer: BallRenderer;
  private hoopRenderer: HoopRenderer;
  private effectsRenderer: EffectsRenderer;
  private trajectoryRenderer: TrajectoryRenderer;

  constructor(ctx: CanvasRenderingContext2D) {
    this.backgroundRenderer = new BackgroundRenderer(ctx);
    this.ballRenderer = new BallRenderer(ctx);
    this.hoopRenderer = new HoopRenderer(ctx);
    this.effectsRenderer = new EffectsRenderer(ctx);
    this.trajectoryRenderer = new TrajectoryRenderer(ctx);
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

  drawTrajectory(start: Vector2, end: Vector2, ballRadius: number): void {
    this.trajectoryRenderer.drawTrajectory(start, end, ballRadius);
  }
}
