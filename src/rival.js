import Actor from './actor.js';
import {RNG} from '../lib/rot/index.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Rival
 * @extends {Actor}
 */
export default class Rival extends Actor {
  /**
   * Creates an instance of Rival.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Rival
   */
  constructor(world, position, char, name) {
    super(world, position);
    this.char = char;
    this.name = name;
    this.health = 5;
    this.damage = 1;
    this.speed = 3;
    this.hasPistol = false;
    this.hasFeather = false;
    this.medkits = 0;
    this.bullets = 0;
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Rival
   */
  act() {
    if (this.isAt(`${this.target[0]},${this.target[1]},${this.z}`)) {
        this.target = [RNG.getUniformInt(3, 48), RNG.getUniformInt(3, 21)];
        console.log('new');
    }
    this.moveToTarget();
  }
}
