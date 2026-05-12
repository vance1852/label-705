import { CONFIG } from "./config";
import { Ball } from "./Ball";
import { Hoop } from "./Hoop";
import { Physics } from "./Physics";
import { Renderer } from "./Renderer";
import { EventEmitter } from "./EventEmitter";
import { InputManager } from "./InputManager";
import { EffectsManager } from "./EffectsManager";
import type { Vector2, ScoreData } from "./types";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private eventEmitter: EventEmitter;
  private physics: Physics;
  private renderer: Renderer;
  private inputManager: InputManager;
  private effectsManager: EffectsManager;

  private ball!: Ball;
  private ballStartPos!: Vector2;
  private hoop!: Hoop;

  private score: number;
  private streak: number;
  private bestStreak: number;
  private shotFired: boolean;
  private lastTime: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.eventEmitter = new EventEmitter();

    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.shotFired = false;
    this.lastTime = 0;

    this.resize();
    this.physics = new Physics();
    this.renderer = new Renderer(this.ctx);

    this.initEntities();

    this.inputManager = new InputManager(this.canvas, this.ball);
    this.effectsManager = new EffectsManager(this.eventEmitter);

    this.bindEvents();
    this.bindInputCallbacks();
  }

  private resize(): void {
    const maxWidth = Math.min(
      window.innerWidth - CONFIG.canvas.widthPadding,
      CONFIG.canvas.maxWidth,
    );
    const maxHeight = Math.min(
      window.innerHeight - CONFIG.canvas.heightPadding,
      CONFIG.canvas.maxHeight,
    );
    this.canvas.width = maxWidth;
    this.canvas.height = maxHeight;
  }

  private initEntities(): void {
    const ballX = this.canvas.width * CONFIG.ball.startX;
    const ballY = this.canvas.height * CONFIG.ball.startY;
    this.ball = new Ball(ballX, ballY);
    this.ballStartPos = { x: ballX, y: ballY };

    const hoopX = this.canvas.width * CONFIG.hoop.x;
    const hoopY = this.canvas.height * CONFIG.hoop.y;
    this.hoop = new Hoop(hoopX, hoopY, CONFIG.hoop.width, CONFIG.hoop.height);
  }

  private bindEvents(): void {
    window.addEventListener("resize", () => {
      this.resize();
      this.initEntities();
      if (this.inputManager) {
        this.inputManager.reset();
      }
    });
  }

  private bindInputCallbacks(): void {
    this.inputManager.setOnShoot((vx: number, vy: number) => {
      this.ball.vx = vx;
      this.ball.vy = vy;
      this.ball.isResting = false;
      this.shotFired = true;
      this.eventEmitter.emit("shoot");
    });
  }

  private update(deltaTime: number): void {
    if (!this.ball.isResting) {
      this.physics.applyGravity(this.ball);
      this.physics.applyAirResistance(this.ball);
      this.ball.update();

      if (this.hoop.checkScore(this.ball)) {
        this.onScore();
      }

      this.hoop.checkRimCollision(this.ball);
      this.hoop.checkBackboardCollision(this.ball);

      const boundaryResult = this.physics.checkBoundaries(
        this.ball,
        this.canvas.width,
        this.canvas.height,
      );

      if (boundaryResult.shouldResetBall) {
        this.resetBall();
      }
    }

    this.effectsManager.update(deltaTime);
  }

  private onScore(): void {
    this.streak++;
    const points = CONFIG.scoring.basePoints * this.streak;
    this.score += points;

    if (this.streak > this.bestStreak) {
      this.bestStreak = this.streak;
    }

    this.eventEmitter.emit("score", {
      x: this.hoop.x,
      y: this.hoop.y,
      points,
    });

    this.updateUI();
  }

  private resetBall(): void {
    this.ball.reset(this.ballStartPos.x, this.ballStartPos.y);
    this.hoop.reset();

    if (this.shotFired && !this.hoop.scored) {
      this.streak = 0;
      this.updateUI();
    }
    this.shotFired = false;
    this.eventEmitter.emit("ballReset");
  }

  private updateUI(): void {
    const data: ScoreData = {
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      points: 0,
    };
    this.eventEmitter.emit("scoreUpdate", data);
  }

  private render(): void {
    this.renderer.clear(this.canvas.width, this.canvas.height);
    this.renderer.drawBackground(this.canvas.width, this.canvas.height);

    const flashIntensity = this.effectsManager.getFlashIntensity();
    if (flashIntensity > 0) {
      this.renderer.drawFlash(
        this.canvas.width,
        this.canvas.height,
        flashIntensity,
      );
    }

    this.renderer.drawHoop(this.hoop);
    this.renderer.drawBall(this.ball);
    this.renderer.drawParticles(this.effectsManager.getParticles());
    this.renderer.drawScoreTexts(this.effectsManager.getScoreTexts());

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

    this.eventEmitter.emit("gameReset");

    this.hoop.reset();
    this.ball.reset(this.ballStartPos.x, this.ballStartPos.y);
    this.inputManager.reset();
    this.updateUI();
  }

  onScoreUpdate(callback: (score: number, streak: number, bestStreak: number) => void): void {
    this.eventEmitter.on("scoreUpdate", (data: ScoreData) => {
      callback(data.score, data.streak, data.bestStreak);
    });
  }
}
