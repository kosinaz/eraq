import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Tarantula
 * @extends {Actor}
 */
export default class Tarantula extends Actor {
  /**
   * Creates an instance of Tarantula.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Tarantula
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐭';
    this.name = 'Tarantula';
    this.health = 1;
    this.damage = 1;
    this.speed = 2;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Tarantula
   */
  act() {
    if (this.target &&
      Math.abs(this.target[0] - this.x) < 3 &&
      Math.abs(this.target[1] - this.y) < 3) {
      this.moveToTarget();
    }
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
    this.world.scene.game.tarantulasound.play();
    this.world.stats.kills.tarantula += 1;
    this.world.stats.point += 2;
  }
}
