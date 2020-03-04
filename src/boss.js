import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Boss
 * @extends {Actor}
 */
export default class Boss extends Actor {
  /**
   * Creates an instance of Boss.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Boss
   */
  constructor(world, position) {
    super(world, position);
    this.char = 'Ŝ';
    this.name = 'doubleheaded snake';
    this.health = 4;
    this.damage = 3;
    this.speed = 2;
    this.world.scheduler.add(this, true);
  }

  /**
   * Opens the game over screen.
   *
   * @memberof Actor
   */
  kill() {
    super.kill();
    this.world.items.set(`26,11,8`, '⤁');
    this.died = true;
  }
}
