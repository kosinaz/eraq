import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Dog
 * @extends {Actor}
 */
export default class Dog extends Actor {
  /**
   * Creates an instance of Dog.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Dog
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐝';
    this.name = 'Dog';
    this.health = 4;
    this.damage = 2;
    this.speed = 4;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Dog
   */
  act() {
    if (this.target) {
      const actor = this.world.actors.find((actor) =>
        actor.isAt(`${this.target[0]},${this.target[1]},${this.z}`),
      );
      if (actor) {
        if (actor.animal) {
          // console.log(this.name, 'is in the same team as its target');
          return;
        }
        if (Math.abs(actor.x - this.x) > 1 ||
          Math.abs(actor.y - this.y) > 1) {
          this.target[0] = this.x - (actor.x > this.x ? 1 : 0);
          this.target[0] = this.x + (actor.x < this.x ? 1 : 0);
          this.target[1] = this.y - (actor.y > this.y ? 1 : 0);
          this.target[1] = this.y + (actor.y < this.y ? 1 : 0);
        }
      } else {
        if (this.world.hero.isAt(
            `${this.target[0]},${this.target[1]},${this.z}`,
        ) &&
        (Math.abs(this.target[0] - this.x) > 1 ||
        Math.abs(this.target[1] - this.y) > 1)) {
          this.target[0] = this.x - (this.world.hero.x > this.x ? 1 : 0);
          this.target[0] = this.x + (this.world.hero.x < this.x ? 1 : 0);
          this.target[1] = this.y - (this.world.hero.y > this.y ? 1 : 0);
          this.target[1] = this.y + (this.world.hero.y < this.y ? 1 : 0);
        }
      }
    }
    this.moveToTarget();
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
    this.world.stats.kills.dog += 1;
    this.world.stats.point += 32;
  }
}
