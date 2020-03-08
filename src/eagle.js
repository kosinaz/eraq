import Actor from './actor.js';
import AStar from '../lib/rot/path/astar.js';
import {RNG} from '../lib/rot/index.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Eagle
 * @extends {Actor}
 */
export default class Eagle extends Actor {
  /**
   * Creates an instance of Eagle.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Eagle
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐞';
    this.name = 'Eagle';
    this.health = 2;
    this.damage = 1;
    this.speed = 4;
    this.turnsSinceAttack = 0;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Eagle
   */
  act() {
    this.turnsSinceAttack += 1;
    if (this.target) {
      if (this.turnsSinceAttack < 5 &&
        (Math.abs(this.target[0] - this.x) > 1 ||
        Math.abs(this.target[1] - this.y) > 1)) {
        this.target[0] = this.x - this.target[0] > this.x ? 1 : 0;
        this.target[0] = this.x + this.target[0] < this.x ? 1 : 0;
        this.target[1] = this.y - this.target[0] > this.y ? 1 : 0;
        this.target[1] = this.y + this.target[0] < this.y ? 1 : 0;
      }
      this.moveToTarget();
    }
  }

  /**
   * Moves the actor towards the target.
   *
   * @memberof Eagle
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
      if (this.isVisible()) {
        this.world.log[0] += ` ${this.name} hit ${actor.name}.`;
      }
      actor.weaken(damage);
      this.turnsSinceAttack = 0;
      return;
    }
    if (
      this.world.hero.isAt(`${this.path[1][0]},${this.path[1][1]},${this.z}`)
    ) {
      let damage = this.damage + RNG.getUniformInt(0, 1);
      damage = ~~(damage / (this.hasFeather ? 2 : 1));
      if (this.isVisible()) {
        this.world.log[0] += ` ${this.name} hit you.`;
      }
      this.world.hero.weaken(damage);
      this.turnsSinceAttack = 0;
      return;
    }
    this.x = this.path[1][0];
    this.y = this.path[1][1];
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
    this.world.stats.kills.eagle += 1;
    this.world.stats.point += 8;
  }
}
