import { Game } from "./game/Game";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const game = new Game(canvas);

  const scoreEl = document.getElementById("score")!;
  const streakEl = document.getElementById("streak")!;
  const bestStreakEl = document.getElementById("best-streak")!;
  const resetBtn = document.getElementById("reset-btn")!;

  game.onScoreUpdate = (score: number, streak: number, bestStreak: number) => {
    scoreEl.textContent = String(score);
    streakEl.textContent = String(streak);
    bestStreakEl.textContent = String(bestStreak);
  };

  resetBtn.addEventListener("click", () => {
    game.reset();
  });

  game.start();
});
