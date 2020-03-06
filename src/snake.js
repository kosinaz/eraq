import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Snake
 * @extends {Actor}
 */
export default class Snake extends Actor {
  /**
   * Creates an instance of Snake.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Snake
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐬';
    this.name = 'Snake';
    this.health = 2;
    this.damage = 1;
    this.speed = 2;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Snake
   */
  act() {
    if (this.target &&
      Math.abs(this.target[0] - this.x) < 2 &&
      Math.abs(this.target[1] - this.y) < 2) {
      this.moveToTarget();
    }
  }
}
