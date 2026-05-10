import { Game } from "./game/Game";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const game = new Game(canvas);

  const scoreEl = document.getElementById("score");
  const streakEl = document.getElementById("streak");
  const bestStreakEl = document.getElementById("best-streak");
  const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

  game.onScoreUpdateCallback = (score, streak, bestStreak) => {
    if (scoreEl) scoreEl.textContent = String(score);
    if (streakEl) streakEl.textContent = String(streak);
    if (bestStreakEl) bestStreakEl.textContent = String(bestStreak);
  };

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      game.reset();
    });
  }

  game.start();
});
