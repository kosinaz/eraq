import Actor from './actor.js';
import AStar from '../lib/rot/path/astar.js';
import {RNG} from '../lib/rot/index.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Lizard
 * @extends {Actor}
 */
export default class Lizard extends Actor {
  /**
   * Creates an instance of Lizard.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Lizard
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐥';
    this.name = 'Lizard';
    this.health = 2;
    this.damage = 1;
    this.speed = 1;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
   * Moves the actor towards the target.
   *
   * @memberof Lizard
   */
  moveToTarget() {
    if (!this.target) {
      // console.log(this.name, 'has no target');
      return;
    }
    if (!this.isPassable(this.target[0], this.target[1])) {
      // console.log(this.name, 'has a nonpassable target');
      return;
    }
    this.path = [];
    new AStar(this.target[0], this.target[1], this.isPassable.bind(this))
        .compute(this.x, this.y, (x, y) => this.path.push([x, y]));
    if (this.path.length < 2) {
      this.target = [this.x, this.y];
      // console.log(this.name, 'is too close to its target');
      return;
    }
    const actor = this.world.actors.find((actor) =>
      actor.isAt(`${this.path[1][0]},${this.path[1][1]},${this.z}`),
    );
    if (actor) {
      if (actor.animal) {
        // console.log(this.name, 'is in the same team as its target');
        return;
      }
      let damage = this.damage + RNG.getUniformInt(0, 1);
      damage = ~~(damage / (this.hasFeather ? 2 : 1));
      actor.weaken(damage);
      actor.poisonRemained = 2;
      return;
    }
    if (
      this.world.hero.isAt(`${this.path[1][0]},${this.path[1][1]},${this.z}`)
    ) {
      let damage = this.damage + RNG.getUniformInt(0, 1);
      damage = ~~(damage / (this.hasFeather ? 2 : 1));
      this.world.hero.weaken(damage);
      this.world.hero.poisonRemained = 2;
      return;
    }
    this.x = this.path[1][0];
    this.y = this.path[1][1];
  }
}
