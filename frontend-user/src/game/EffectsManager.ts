import { CONFIG } from "./config";
import { EventEmitter } from "./EventEmitter";
import type { Particle, ScoreText } from "./types";

export class EffectsManager {
  private eventEmitter: EventEmitter;
  private particles: Particle[];
  private scoreTexts: ScoreText[];
  private flashIntensity: number;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.particles = [];
    this.scoreTexts = [];
    this.flashIntensity = 0;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventEmitter.on("score", (data: { x: number; y: number; points: number }) => {
      this.triggerScoreEffects(data.x, data.y, data.points);
    });

    this.eventEmitter.on("gameReset", () => {
      this.reset();
    });
  }

  private triggerScoreEffects(x: number, y: number, points: number): void {
    this.flashIntensity = CONFIG.effects.flash.intensity;
    this.createParticles(x, y + 20, CONFIG.effects.particle.count);
    this.scoreTexts.push({
      x,
      y: y - 20,
      text: `+${points}`,
      life: CONFIG.effects.scoreText.life,
    });
  }

  private createParticles(x: number, y: number, count: number): void {
    const colors = CONFIG.effects.colors;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * CONFIG.effects.particle.initialSpeed,
        vy: (Math.random() - 0.5) * CONFIG.effects.particle.initialSpeed + CONFIG.effects.particle.initialYOffset,
        life: CONFIG.effects.particle.lifeBase + Math.random() * CONFIG.effects.particle.lifeRandom,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: CONFIG.effects.particle.sizeBase + Math.random() * CONFIG.effects.particle.sizeRandom,
      });
    }
  }

  update(deltaTime: number): void {
    this.updateParticles(deltaTime);
    this.updateScoreTexts(deltaTime);
    if (this.flashIntensity > 0) {
      this.flashIntensity -= deltaTime * CONFIG.effects.flash.decayRate;
    }
  }

  private updateParticles(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.life -= deltaTime * CONFIG.effects.particle.lifeDamping;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += CONFIG.effects.particle.gravity;
      p.vx *= CONFIG.effects.particle.airResistance;
      return p.life > 0;
    });
  }

  private updateScoreTexts(deltaTime: number): void {
    this.scoreTexts = this.scoreTexts.filter((t) => {
      t.life -= deltaTime * CONFIG.effects.scoreText.lifeDamping;
      t.y -= CONFIG.effects.scoreText.ySpeed;
      return t.life > 0;
    });
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  getScoreTexts(): ScoreText[] {
    return this.scoreTexts;
  }

  getFlashIntensity(): number {
    return Math.max(0, this.flashIntensity);
  }

  reset(): void {
    this.particles = [];
    this.scoreTexts = [];
    this.flashIntensity = 0;
  }
}
