import { Ball } from "./Ball";
import { Hoop } from "./Hoop";
import { Physics } from "./Physics";
import { Renderer } from "./Renderer";
import { InputManager } from "./InputManager";
import { EffectsManager } from "./EffectsManager";
import { EventEmitter } from "./EventEmitter";
import { GameEvents, CanvasSize, Point, ScorePayload } from "./types";
import { GAME_CONFIG } from "./config";

export class Game {
  private canvas: HTMLCanvasElement;
  private canvasSize: CanvasSize;
  private ball: Ball;
  private ballStartPos: Point;
  private hoop: Hoop;
  private physics: Physics;
  private renderer: Renderer;
  private inputManager: InputManager;
  private effectsManager: EffectsManager;
  private eventEmitter: EventEmitter<GameEvents>;

  score: number;
  streak: number;
  bestStreak: number;
  onScoreUpdate:
    | ((score: number, streak: number, bestStreak: number) => void)
    | null;

  private shotFired: boolean;
  private lastTime: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasSize = this.calculateCanvasSize();
    canvas.width = this.canvasSize.width;
    canvas.height = this.canvasSize.height;

    this.eventEmitter = new EventEmitter<GameEvents>();
    this.physics = new Physics();
    this.renderer = new Renderer(canvas.getContext("2d")!);
    this.inputManager = new InputManager(canvas);
    this.effectsManager = new EffectsManager(this.eventEmitter);

    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.onScoreUpdate = null;
    this.shotFired = false;
    this.lastTime = 0;

    this.ball = this.createBall();
    this.ballStartPos = { x: this.ball.x, y: this.ball.y };
    this.hoop = this.createHoop();

    this.inputManager.setBall(this.ball);
    this.inputManager.setOnShot((vx, vy) => this.onShot(vx, vy));

    this.bindResize();
  }

  private calculateCanvasSize(): CanvasSize {
    return {
      width: Math.min(
        window.innerWidth - GAME_CONFIG.CANVAS_MAX_WIDTH_PADDING,
        GAME_CONFIG.CANVAS_MAX_WIDTH,
      ),
      height: Math.min(
        window.innerHeight - GAME_CONFIG.CANVAS_MAX_HEIGHT_PADDING,
        GAME_CONFIG.CANVAS_MAX_HEIGHT,
      ),
    };
  }

  private createBall(): Ball {
    return new Ball(
      this.canvasSize.width * GAME_CONFIG.BALL_START_X_RATIO,
      this.canvasSize.height * GAME_CONFIG.BALL_START_Y_RATIO,
      GAME_CONFIG.BALL_RADIUS,
    );
  }

  private createHoop(): Hoop {
    return new Hoop(
      this.canvasSize.width * GAME_CONFIG.HOOP_X_RATIO,
      this.canvasSize.height * GAME_CONFIG.HOOP_Y_RATIO,
      GAME_CONFIG.HOOP_WIDTH,
      GAME_CONFIG.HOOP_HEIGHT,
    );
  }

  private bindResize(): void {
    window.addEventListener("resize", () => {
      this.canvasSize = this.calculateCanvasSize();
      this.canvas.width = this.canvasSize.width;
      this.canvas.height = this.canvasSize.height;
      this.ball = this.createBall();
      this.ballStartPos = { x: this.ball.x, y: this.ball.y };
      this.hoop = this.createHoop();
      this.inputManager.setBall(this.ball);
    });
  }

  private onShot(vx: number, vy: number): void {
    this.ball.vx = vx;
    this.ball.vy = vy;
    this.ball.isResting = false;
    this.shotFired = true;
    this.eventEmitter.emit("shotFired");
  }

  private handleScore(): void {
    this.streak++;
    const points = GAME_CONFIG.STREAK_SCORE_BASE * this.streak;
    this.score += points;

    if (this.streak > this.bestStreak) {
      this.bestStreak = this.streak;
    }

    this.effectsManager.createParticles(
      this.hoop.x,
      this.hoop.y + GAME_CONFIG.SCORE_TEXT_BELOW_HOOP_Y,
      GAME_CONFIG.PARTICLE_COUNT,
    );
    this.effectsManager.addScoreText(
      this.hoop.x,
      this.hoop.y + GAME_CONFIG.SCORE_TEXT_OFFSET_Y,
      points,
    );

    const payload: ScorePayload = {
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
    };
    this.eventEmitter.emit("score", payload);
    this.updateUI();
  }

  private resetBall(): void {
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
    this.eventEmitter.emit("ballReset");
  }

  private updateUI(): void {
    this.onScoreUpdate?.(this.score, this.streak, this.bestStreak);
  }

  private update(deltaTime: number): void {
    if (!this.ball.isResting) {
      this.physics.applyGravity(this.ball);
      this.physics.applyAirResistance(this.ball);
      this.ball.update();

      if (this.hoop.checkScore(this.ball)) {
        this.handleScore();
      }

      this.hoop.checkRimCollision(this.ball);
      this.hoop.checkBackboardCollision(this.ball);

      const shouldReset = this.physics.checkBoundaries(
        this.ball,
        this.canvasSize,
      );
      if (shouldReset) {
        this.resetBall();
      }
    }

    this.effectsManager.update(deltaTime);
  }

  private render(): void {
    const drag = this.inputManager.getDrag();
    this.renderer.render(
      this.canvasSize,
      this.ball,
      this.hoop,
      this.effectsManager,
      drag.isDragging ? drag : null,
    );
  }

  private gameLoop(timestamp: number): void {
    const deltaTime = Math.min(
      (timestamp - this.lastTime) / GAME_CONFIG.DELTA_TIME_DIVISOR,
      GAME_CONFIG.DELTA_TIME_MAX,
    );
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
    this.hoop.reset();
    this.ball.x = this.ballStartPos.x;
    this.ball.y = this.ballStartPos.y;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.isResting = true;
    this.updateUI();
  }
}
