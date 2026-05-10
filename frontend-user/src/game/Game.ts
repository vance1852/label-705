import { Ball } from "./Ball";
import { Hoop } from "./Hoop";
import { Physics } from "./Physics";
import { Renderer } from "./Renderer";
import { EventEmitter } from "./EventEmitter";
import { InputManager } from "./InputManager";
import { EffectsManager } from "./EffectsManager";
import { Vector2D, ScoreData } from "./types";
import { GAME, SCORING, UI } from "./config";

export type ScoreUpdateCallback = (score: number, streak: number, bestStreak: number) => void;

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private emitter: EventEmitter;
  private physics: Physics;
  private renderer: Renderer;
  private inputManager: InputManager;
  private effectsManager: EffectsManager;

  private ball: Ball | null = null;
  private hoop: Hoop | null = null;
  private ballStartPos: Vector2D = { x: 0, y: 0 };

  private score: number = 0;
  private streak: number = 0;
  private bestStreak: number = 0;
  private onScoreUpdate: ScoreUpdateCallback | null = null;

  private shotFired: boolean = false;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.emitter = new EventEmitter();
    this.physics = new Physics();
    this.renderer = new Renderer(this.ctx);
    this.inputManager = new InputManager(this.canvas, this.emitter, () => this.ball);
    this.effectsManager = new EffectsManager(this.emitter);

    this.bindEmitterEvents();
    this.resize();
    this.init();
    this.inputManager.bindEvents();
  }

  private bindEmitterEvents(): void {
    this.emitter.on("resize", () => {
      this.resize();
      this.init();
    });

    this.emitter.on("shotFired", () => {
      this.shotFired = true;
    });
  }

  private resize(): void {
    const maxWidth = Math.min(window.innerWidth - UI.canvasPaddingWidth, UI.canvasMaxWidth);
    const maxHeight = Math.min(window.innerHeight - UI.canvasPaddingHeight, UI.canvasMaxHeight);
    this.canvas.width = maxWidth;
    this.canvas.height = maxHeight;
  }

  private init(): void {
    const ballX = this.canvas.width * GAME.ballStartXFactor;
    const ballY = this.canvas.height * GAME.ballStartYFactor;
    this.ball = new Ball(ballX, ballY, GAME.ballRadius);
    this.ballStartPos = { x: ballX, y: ballY };

    const hoopX = this.canvas.width * GAME.hoopXFactor;
    const hoopY = this.canvas.height * GAME.hoopYFactor;
    this.hoop = new Hoop(hoopX, hoopY, GAME.hoopWidth, GAME.hoopHeight);
  }

  private update(deltaTime: number): void {
    if (!this.ball || !this.hoop) return;

    if (!this.ball.isResting) {
      this.physics.applyGravity(this.ball);
      this.physics.applyAirResistance(this.ball);
      this.ball.update();

      if (this.hoop.checkScore(this.ball)) {
        this.onScore();
      }

      this.hoop.checkRimCollision(this.ball);
      this.hoop.checkBackboardCollision(this.ball);

      const result = this.physics.checkBoundaries(
        this.ball,
        this.canvas.width,
        this.canvas.height,
      );
      if (result.shouldReset) {
        this.resetBall();
      }
    }

    this.effectsManager.update(deltaTime);
  }

  private onScore(): void {
    if (!this.hoop) return;

    this.streak++;
    const points = SCORING.basePoints * this.streak;
    this.score += points;

    if (this.streak > this.bestStreak) {
      this.bestStreak = this.streak;
    }

    this.emitter.emit("score", points, this.hoop.x, this.hoop.y);
    this.updateUI();
  }

  private resetBall(): void {
    if (!this.ball || !this.hoop) return;

    this.ball.x = this.ballStartPos.x;
    this.ball.y = this.ballStartPos.y;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.isResting = true;
    this.hoop.reset();

    if (this.shotFired && !this.hoop.scored) {
      this.streak = 0;
      this.updateUI();
    }
    this.shotFired = false;
  }

  private updateUI(): void {
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.streak, this.bestStreak);
    }
  }

  private render(): void {
    if (!this.ball || !this.hoop) return;

    this.renderer.clear(this.canvas.width, this.canvas.height);
    this.renderer.drawBackground(this.canvas.width, this.canvas.height);

    if (this.effectsManager.flashIntensity > 0) {
      this.renderer.drawFlash(
        this.canvas.width,
        this.canvas.height,
        this.effectsManager.flashIntensity,
      );
    }

    this.renderer.drawHoop(this.hoop);
    this.renderer.drawBall(this.ball);
    this.renderer.drawParticles(this.effectsManager.particles);
    this.renderer.drawScoreTexts(this.effectsManager.scoreTexts);

    const dragState = this.inputManager.getDragState();
    if (dragState.isDragging) {
      this.renderer.drawTrajectory(
        dragState.dragStart,
        dragState.dragEnd,
        this.ball.radius,
      );
    }
  }

  private gameLoop(timestamp: number): void {
    const deltaTime = Math.min((timestamp - this.lastTime) / 16.67, 2);
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  start(): void {
    this.lastTime = performance.now();
    this.updateUI();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  reset(): void {
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.shotFired = false;
    this.effectsManager.reset();
    if (this.hoop) this.hoop.reset();
    if (this.ball) {
      this.ball.x = this.ballStartPos.x;
      this.ball.y = this.ballStartPos.y;
      this.ball.vx = 0;
      this.ball.vy = 0;
      this.ball.isResting = true;
    }
    this.updateUI();
  }

  set onScoreUpdateCallback(callback: ScoreUpdateCallback | null) {
    this.onScoreUpdate = callback;
  }

  getScoreData(): ScoreData {
    return {
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
    };
  }
}
