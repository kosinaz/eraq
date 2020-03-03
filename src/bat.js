import Actor from './actor.js';
import {RNG} from '../lib/rot/index.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Bat
 * @extends {Actor}
 */
export default class Bat extends Actor {
  /**
   * Creates an instance of Bat.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Bat
   */
  constructor(world, position) {
    super(world, position);
    this.char = 'ᨓ';
    this.name = 'bat';
    this.health = 3;
    this.damage = 1;
    this.speed = 3;
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Actor
   */
  act() {
    this.target = [
      this.x - RNG.getItem([-1, 1]),
      this.y - RNG.getItem([-1, 1]),
    ];
    this.moveToTarget();
  }
}
