import {RNG} from '../lib/rot/index.js';
import AStar from '../lib/rot/path/astar.js';

/**
 * Represents a character that has an act function continuosly called by the
 * engine.
 *
 * @export
 * @class Actor
 */
export default class Actor {
  /**
   * Creates an instance of Actor.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Actor
   */
  constructor(world, position) {
    this.world = world;
    this.pos = position.split(',');
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Actor
   */
  act() {
    this.moveToTarget();
  }

  /**
   * The speed of the actor.
   *
   * @return {number}
   * @memberof Actor
   */
  getSpeed() {
    return this.speed;
  }

  /**
   * The x coordinate of the actor.
   *
   * @readonly
   * @memberof Actor
   */
  get x() {
    return +this.pos[0];
  }

  /**
   * The y coordinate of the actor.
   *
   * @readonly
   * @memberof Actor
   */
  get y() {
    return +this.pos[1];
  }

  /**
   * The z coordinate of the actor.
   *
   * @readonly
   * @memberof Actor
   */
  get z() {
    return +this.pos[2];
  }

  /**
   * Set the x coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set x(n) {
    this.pos[0] = n;
  }

  /**
   * Set the y coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set y(n) {
    this.pos[1] = n;
  }

  /**
   * Set the z coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set z(n) {
    this.pos[2] = n;
  }

  /**
   * Decrease the actor's health with the specified value and kill him if
   * needed.
   *
   * @param {number} value
   * @memberof Actor
   */
  weaken(value) {
    this.health -= value;
    this.world.log[0] += ` ${this.name} lost ${value} health `;
    if (this.health < 1) {
      this.world.log[0] += `and died `;
      this.kill();
    }
  }

  /**
   * Returns the specified x and y with the actor's z position.
   *
   * @param {number} x
   * @param {number} y
   * @return {string} The actor's shifted position.
   * @memberof Actor
   */
  getPosition(x, y) {
    return `${x},${y},${this.z}`;
  }

  /**
   * Sets the specified array of numbers as the position of the actor.
   *
   * @param {number[]} position The position of the actor.
   * @memberof Actor
   */
  set position(position) {
    this.pos = position;
  }

  /**
   * Returns the position of the actor as a comma separated string.
   *
   * @readonly
   * @memberof Actor
   */
  get position() {
    return this.pos.toString();
  }

  /**
   * Returns true if the actor is at the position specified by a comma
   * separated string.
   *
   * @param {string} position The position to check.
   * @return {boolean} True if the actor is at the position.
   * @memberof Actor
   */
  isAt(position) {
    return this.position === position;
  }

  /**
   * Returns true if the actor is at the specified x and y with the actor's z
   * position.
   *
   * @param {number} x The x position to check.
   * @param {number} y The y position to check.
   * @return {boolean} True if the actor is at the position.
   * @memberof Actor
   */
  isAtXY(x, y) {
    return this.isAt(this.getPosition(x, y));
  }

  /**
   * Moves the actor towards the target.
   *
   * @memberof Actor
   */
  moveToTarget() {
    if (!this.target) {
      return;
    }
    if (!this.isPassable(this.target[0], this.target[1])) {
      return;
    }
    this.path = [];
    new AStar(this.target[0], this.target[1], this.isPassable.bind(this))
        .compute(this.x, this.y, (x, y) => this.path.push([x, y]));
    if (this.path.length < 2) {
      return;
    }
    const actor = this.world.actors.find(
        (actor) => actor.x === this.path[1][0] && actor.y === this.path[1][1],
    );
    if (actor) {
      return;
    }
    if (
      this.world.hero.isAt(`${this.path[1][0]},${this.path[1][1]},${this.z}`)
    ) {
      this.world.hero.weaken(this.damage + RNG.getUniformInt(0, 1));
      return;
    } else {
      this.x = this.path[1][0];
      this.y = this.path[1][1];
    }
  }

  /**
   * Returns true if the specified x,y position on the current z position
   * of the actor is passable by the actor;
   *
   * @param {number} x The x coordinate of the actor's position.
   * @param {number} y The y coordinate of the actor's position.
   * @return {boolean} Returns true if the specified position is passable.
   * @memberof Actor
   */
  isPassable(x, y) {
    const char = this.world.map.get(this.getPosition(x, y));
    return char !== '#' && char !== '~' && char !== '♣' && char !== undefined;
  }

  /**
   * Kills the actor.
   *
   * @memberof Actor
   */
  kill() {
    this.world.actors.splice(this.world.actors.indexOf(this), 1);
    this.world.scheduler.remove(this);
  }
}
