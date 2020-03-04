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
    this.char = 'ŝ';
    this.name = 'snake';
    this.health = 3;
    this.damage = 1;
    this.speed = 2;
    this.world.scheduler.add(this, true);
  }
}
