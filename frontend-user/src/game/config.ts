export const CONFIG = {
  physics: {
    gravity: 0.5,
    airResistance: 0.995,
  },

  ball: {
    radius: 22,
    startX: 0.15,
    startY: 0.7,
    angularVelocityDamping: 0.98,
  },

  hoop: {
    x: 0.78,
    y: 0.32,
    width: 55,
    height: 40,
    rimRadius: 8,
    backboardWidth: 10,
    backboardHeight: 80,
    netSegments: 6,
    scoreTimeout: 800,
  },

  input: {
    powerMultiplier: 0.15,
    maxPower: 22,
    minPower: 2,
    dragRadiusMultiplier: 3,
  },

  canvas: {
    maxWidth: 800,
    maxHeight: 500,
    widthPadding: 40,
    heightPadding: 200,
    floorHeight: 40,
  },

  effects: {
    particle: {
      count: 50,
      initialSpeed: 15,
      initialYOffset: -5,
      lifeBase: 1,
      lifeRandom: 0.5,
      lifeDamping: 0.025,
      gravity: 0.3,
      airResistance: 0.98,
      sizeBase: 4,
      sizeRandom: 4,
    },
    scoreText: {
      life: 1.5,
      lifeDamping: 0.02,
      ySpeed: 1.5,
    },
    flash: {
      decayRate: 0.08,
      intensity: 1,
      alphaMultiplier: 0.4,
    },
    colors: ["#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#ef4444"],
  },

  collision: {
    floorBounce: -0.6,
    floorFriction: 0.8,
    minVyToRest: 1.5,
    minVxToRest: 1,
    wallBounce: -0.7,
    ceilingBounce: -0.7,
    rimRestitution: 1.5,
    rimFriction: 0.7,
    backboardBounce: -0.6,
  },

  trajectory: {
    points: 25,
    baseSize: 5,
    sizeDecay: 0.15,
    powerBarWidth: 80,
    powerBarHeight: 8,
    powerBarYOffset: 45,
  },

  scoring: {
    basePoints: 10,
  },
} as const;
