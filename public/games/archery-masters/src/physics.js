const GRAVITY = -3.8;

export class BrowserPhysicsEngine {
  constructor() {
    this.projectile = null;
  }

  launch({ x, y, angle, power, owner }) {
    this.projectile = {
      x,
      y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      owner,
      age: 0,
      trail: [],
    };
  }

  step(delta) {
    if (!this.projectile) return null;
    const shot = this.projectile;
    const dt = Math.min(delta, 0.033);
    shot.age += dt;
    shot.vy += GRAVITY * dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.trail.push({ x: shot.x, y: shot.y });
    if (shot.trail.length > 18) shot.trail.shift();
    if (shot.y < 0.13 || shot.x < -0.08 || shot.x > 1.08 || shot.age > 2.7) {
      const result = { ...shot, hit: shot.x > 0.74 || shot.x < 0.26 };
      this.projectile = null;
      return result;
    }
    return shot;
  }
}

