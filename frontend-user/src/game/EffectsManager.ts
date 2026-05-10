import { Particle, ScoreText } from "./types";
import { GAME_CONFIG } from "./config";
import { EventEmitter } from "./EventEmitter";
import { GameEvents } from "./types";

export class EffectsManager {
  particles: Particle[];
  scoreTexts: ScoreText[];
  flashIntensity: number;
  private eventEmitter: EventEmitter<GameEvents>;

  constructor(eventEmitter: EventEmitter<GameEvents>) {
    this.particles = [];
    this.scoreTexts = [];
    this.flashIntensity = 0;
    this.eventEmitter = eventEmitter;
    this.eventEmitter.on("score", (payload) => this.onScore(payload));
  }

  private onScore(payload: {
    score: number;
    streak: number;
    bestStreak: number;
  }): void {
    this.flashIntensity = GAME_CONFIG.FLASH_INTENSITY;
  }

  createParticles(x: number, y: number, count: number): void {
    const colors = GAME_CONFIG.PARTICLE_COLORS;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * GAME_CONFIG.PARTICLE_VX_RANGE,
        vy:
          (Math.random() - 0.5) * GAME_CONFIG.PARTICLE_VY_RANGE +
          GAME_CONFIG.PARTICLE_VY_OFFSET,
        life:
          GAME_CONFIG.PARTICLE_LIFE_BASE +
          Math.random() * GAME_CONFIG.PARTICLE_LIFE_RANDOM,
        color: colors[Math.floor(Math.random() * colors.length)],
        size:
          GAME_CONFIG.PARTICLE_SIZE_BASE +
          Math.random() * GAME_CONFIG.PARTICLE_SIZE_RANDOM,
      });
    }
  }

  addScoreText(x: number, y: number, points: number): void {
    this.scoreTexts.push({
      x,
      y,
      text: `+${points}`,
      life: GAME_CONFIG.SCORE_TEXT_LIFE,
    });
  }

  triggerFlash(): void {
    this.flashIntensity = GAME_CONFIG.FLASH_INTENSITY;
  }

  update(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.life -= deltaTime * GAME_CONFIG.PARTICLE_LIFE_DECAY;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += GAME_CONFIG.PARTICLE_GRAVITY;
      p.vx *= GAME_CONFIG.PARTICLE_FRICTION;
      return p.life > 0;
    });

    this.scoreTexts = this.scoreTexts.filter((t) => {
      t.life -= deltaTime * GAME_CONFIG.SCORE_TEXT_LIFE_DECAY;
      t.y -= GAME_CONFIG.SCORE_TEXT_RISE_SPEED;
      return t.life > 0;
    });

    if (this.flashIntensity > 0) {
      this.flashIntensity -= deltaTime * GAME_CONFIG.FLASH_DECAY_RATE;
    }
  }

  reset(): void {
    this.particles = [];
    this.scoreTexts = [];
    this.flashIntensity = 0;
  }
}
