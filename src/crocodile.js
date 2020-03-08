import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Crocodile
 * @extends {Actor}
 */
export default class Crocodile extends Actor {
  /**
   * Creates an instance of Crocodile.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Crocodile
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐜';
    this.name = 'Crocodile';
    this.health = 10;
    this.damage = 4;
    this.speed = 1;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }
  /**
   * Kills the actor.
   *
   * @param {boolean} hero
   * @memberof Actor
   */
  kill(hero) {
    super.kill();
    if (!hero) {
      return;
    }
    this.world.stats.kills.crocodile += 1;
    this.world.stats.point += 40;
  }
}
