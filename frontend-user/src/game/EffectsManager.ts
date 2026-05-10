import { EventEmitter } from "./EventEmitter";
import { Particle, ScoreText } from "./types";
import { EFFECTS, COLORS } from "./config";

export class EffectsManager {
  private emitter: EventEmitter;
  particles: Particle[];
  scoreTexts: ScoreText[];
  flashIntensity: number;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.particles = [];
    this.scoreTexts = [];
    this.flashIntensity = 0;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.emitter.on("score", (points: number, x: number, y: number) => {
      this.onScore(points, x, y);
    });
  }

  private onScore(points: number, x: number, y: number): void {
    this.flashIntensity = 1;
    this.createParticles(x, y + 20);
    this.scoreTexts.push({
      x,
      y: y - 20,
      text: `+${points}`,
      life: EFFECTS.scoreTextLife,
    });
  }

  createParticles(x: number, y: number): void {
    const colors = COLORS.particleColors;
    for (let i = 0; i < EFFECTS.particleCount; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * EFFECTS.particleVxRange,
        vy: (Math.random() - 0.5) * EFFECTS.particleVyRange - 5,
        life: EFFECTS.particleLife + Math.random() * EFFECTS.particleLifeVariation,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: EFFECTS.particleSize + Math.random() * EFFECTS.particleSizeVariation,
      });
    }
  }

  update(deltaTime: number): void {
    this.updateParticles(deltaTime);
    this.updateScoreTexts(deltaTime);
    if (this.flashIntensity > 0) {
      this.flashIntensity -= deltaTime * EFFECTS.flashDecay;
    }
  }

  private updateParticles(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.life -= deltaTime * EFFECTS.particleDecay;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += EFFECTS.particleGravity;
      p.vx *= EFFECTS.particleAirResistance;
      return p.life > 0;
    });
  }

  private updateScoreTexts(deltaTime: number): void {
    this.scoreTexts = this.scoreTexts.filter((t) => {
      t.life -= deltaTime * EFFECTS.scoreTextDecay;
      t.y -= EFFECTS.scoreTextRise;
      return t.life > 0;
    });
  }

  reset(): void {
    this.particles = [];
    this.scoreTexts = [];
    this.flashIntensity = 0;
  }
}
