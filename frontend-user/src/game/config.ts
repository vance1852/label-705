export const PHYSICS = {
  gravity: 0.5,
  airResistance: 0.995,
};

export const GAME = {
  ballRadius: 22,
  hoopWidth: 55,
  hoopHeight: 40,
  floorHeight: 40,
  shotPowerMultiplier: 0.15,
  maxPower: 22,
  minPower: 2,
  ballStartXFactor: 0.15,
  ballStartYFactor: 0.7,
  hoopXFactor: 0.78,
  hoopYFactor: 0.32,
  dragDistanceThreshold: 3,
};

export const COLLISION = {
  floorBounceY: 0.6,
  floorBounceX: 0.8,
  wallBounce: 0.7,
  ceilingBounce: 0.7,
  rimBounce: 0.7,
  rimEnergyLoss: 1.5,
  backboardBounce: 0.6,
  restingThresholdVy: 1.5,
  restingThresholdVx: 1,
};

export const EFFECTS = {
  particleCount: 50,
  particleVxRange: 15,
  particleVyRange: 10,
  particleGravity: 0.3,
  particleAirResistance: 0.98,
  particleLife: 1,
  particleLifeVariation: 0.5,
  particleSize: 4,
  particleSizeVariation: 4,
  particleDecay: 0.025,
  scoreTextLife: 1.5,
  scoreTextDecay: 0.02,
  scoreTextRise: 1.5,
  flashDecay: 0.08,
  flashIntensity: 0.4,
};

export const COLORS = {
  particleColors: ["#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#ef4444"],
  scoreText: "#22c55e",
  backgroundTop: "#1e3a5f",
  backgroundBottom: "#0f172a",
  floor: "#8b5a2b",
  flash: "rgba(255, 220, 100, ",
};

export const UI = {
  powerBarWidth: 80,
  powerBarHeight: 8,
  powerBarOffsetY: 45,
  trajectoryPoints: 25,
  trajectoryBaseSize: 5,
  trajectorySizeDecay: 0.15,
  canvasMaxWidth: 800,
  canvasMaxHeight: 500,
  canvasPaddingWidth: 40,
  canvasPaddingHeight: 200,
};

export const SCORING = {
  basePoints: 10,
  scoredCooldown: 800,
};
