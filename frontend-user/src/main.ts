import { Game } from "./game/Game";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const game = new Game(canvas);

  const scoreEl = document.getElementById("score");
  const streakEl = document.getElementById("streak");
  const bestStreakEl = document.getElementById("best-streak");
  const resetBtn = document.getElementById("reset-btn");

  game.onScoreUpdate((score: number, streak: number, bestStreak: number) => {
    if (scoreEl) scoreEl.textContent = String(score);
    if (streakEl) streakEl.textContent = String(streak);
    if (bestStreakEl) bestStreakEl.textContent = String(bestStreak);
  });

  resetBtn?.addEventListener("click", () => {
    game.reset();
  });

  game.start();
});
