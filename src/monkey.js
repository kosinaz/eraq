import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Monkey
 * @extends {Actor}
 */
export default class Monkey extends Actor {
  /**
   * Creates an instance of Monkey.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Monkey
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐦';
    this.name = 'Monkey';
    this.health = 3;
    this.damage = 0;
    this.speed = 4;
    this.stole = false;
    this.hasPistol = false;
    this.medkits = 0;
    this.bullets = 0;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
  * The function that determines the actor's next action. Called by the engine.
  *
  * @memberof Monkey
  */
  act() {
    if (this.target) {
      if (this.stole) {
        this.target[0] = this.x - this.target[0] > this.x ? 1 : 0;
        this.target[0] = this.x + this.target[0] < this.x ? 1 : 0;
        this.target[1] = this.y - this.target[0] > this.y ? 1 : 0;
        this.target[1] = this.y + this.target[0] < this.y ? 1 : 0;
      } else if (
        this.world.hero.isAt(`${this.target[0]},${this.target[1]},${this.z}`) &&
        Math.abs(this.target[0] - this.x) < 2 &&
        Math.abs(this.target[1] - this.y) < 2) {
        if (this.world.hero.hasPistol) {
          this.world.hero.hasPistol = false;
          this.hasPistol = true;
          this.world.log.unshift(' Monkey stole your pistol!');
        } else if (this.world.hero.medkits > 0) {
          this.world.hero.medkits -= 1;
          this.medkits += 1;
          this.world.log.unshift(' Monkey stole your 1+!');
        } else if (this.world.hero.bullets > 5) {
          this.world.hero.bullets -= 6;
          this.bullets += 6;
          this.world.log.unshift(' Monkey stole your 6⁍!');
        }
        this.target[0] = this.x - this.target[0] > this.x ? 1 : 0;
        this.target[0] = this.x + this.target[0] < this.x ? 1 : 0;
        this.target[1] = this.y - this.target[0] > this.y ? 1 : 0;
        this.target[1] = this.y + this.target[0] < this.y ? 1 : 0;
      }
      this.moveToTarget();
    }
  }

  /**
   * Kills the actor.
   *
   * @memberof Actor
   */
  kill() {
    this.world.actors.splice(this.world.actors.indexOf(this), 1);
    this.world.scheduler.remove(this);
    if (this.hasPistol) {
      this.world.items.set(floors.pop(), '⌐');
    } else if (this.medkits > 0) {
      this.world.items.set(floors.pop(), '+');
    } else if (this.bullets > 5) {
      this.world.items.set(floors.pop(), '⁍');
    }
  }
}
