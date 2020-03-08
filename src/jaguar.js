import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Jaguar
 * @extends {Actor}
 */
export default class Jaguar extends Actor {
  /**
   * Creates an instance of Jaguar.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Jaguar
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐣';
    this.name = 'Jaguar';
    this.health = 4;
    this.damage = 2;
    this.speed = 4;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Jaguar
   */
  act() {
    if (this.target &&
      Math.abs(this.target[0] - this.x) < 5 &&
      Math.abs(this.target[1] - this.y) < 5) {
      this.moveToTarget();
    }
  }
}
