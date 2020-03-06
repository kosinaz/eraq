import {RNG} from '../lib/rot/index.js';
import Actor from './actor.js';
import PreciseShadowcasting from '../lib/rot/fov/precise-shadowcasting.js';
import AStar from '../lib/rot/path/astar.js';

/**
 * Represents an actor that can be controlled by the player.
 *
 * @export
 * @class Hero
 * @extends {Actor}
 */
export default class Hero extends Actor {
  /**
   * Creates an instance of Hero.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Hero
   */
  constructor(world, position) {
    super(world, position);
    this.turns = 1;
    this.char = 'Ⓡ';
    this.name = 'You';
    this.health = 10;
    this.damage = 1;
    this.speed = 3;
    this.hasPistol = false;
    this.hasFeather = false;
    this.medkits = 0;
    this.bullets = 0;
    this.explored = new Set();
    this.fov = new Set();
    this.ps = new PreciseShadowcasting(this.isPassable.bind(this));
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Hero
   */
  act() {
    this.turns += 1;
    if (this.poisonRemained) {
      this.weakenAndLog(1);
      this.poisonRemained -= 1;
    }
    this.fov = new Set();
    this.ps.compute(this.x, this.y, 11, (x, y) => {
      this.fov.add(`${x},${y}`);
      const position = this.getPosition(x, y);
      if (!this.explored.has(position)) {
        this.explored.add(position);
      }
    });
    this.world.update();
    this.world.engine.lock();
    if (this.target) {
      setTimeout(this.moveToTargetAndUnlock.bind(this), 100);
    }
  }

  /**
   * Moves the hero towards the target.
   *
   * @memberof Hero
   */
  moveToTargetAndUnlock() {
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
    const actor = this.world.actors.find((actor) =>
      actor.isAt(this.getPosition(this.path[1][0], this.path[1][1])),
    );
    if (actor) {
      let damage = this.damage + RNG.getUniformInt(0, 1);
      damage *= this.hasFeather ? 2 : 1;
      this.world.log.unshift(` You hit ${actor.name}.`);
      actor.weaken(damage);
      this.target = null;
    } else {
      this.x = this.path[1][0];
      this.y = this.path[1][1];
      let char = this.world.items.get(this.position);
      if (char) {
        if (char === '⤁') {
          this.world.items.delete(this.position);
          this.hasFeather = true;
          this.speed = 6;
          this.world.log.unshift(` YOU HAVE THE GOLDEN FEATHER!`);
        } else if (char === '+' && this.medkits < 5) {
          this.world.items.delete(this.position);
          this.medkits += 1;
          this.world.log.unshift(` You picked up 1+.`);
        } else if (char === '⊠') {
          this.world.items.delete(this.position);
          const bullets = RNG.getUniformInt(1, 6);
          this.bullets += bullets;
          this.world.log.unshift(` You picked up ${bullets}⁍.`);
        } else if (char === '⌐') {
          this.world.items.delete(this.position);
          const bullets = RNG.getUniformInt(1, 6);
          this.hasPistol = true;
          this.damage = 3;
          this.bullets += bullets;
          this.world.log.unshift(` You picked up a pistol with ${bullets}⁍.`);
        }
      }
      char = this.world.map.get(this.position);
      if (char === '<') {
        this.z -= 1;
        this.x = this.world.downs[this.z][0];
        this.y = this.world.downs[this.z][1];
        this.world.log.unshift(
            ` You returned to level ${this.world.hero.z}.`,
        );
      } else if (char === '>') {
        this.z += 1;
        this.x = this.world.ups[this.z][0];
        this.y = this.world.ups[this.z][1];
        this.world.log.unshift(
            ` You went down to level ${this.world.hero.z}.`,
        );
      }
    }
    this.ps.compute(this.x, this.y, 11, (x, y) => {
      const actor = this.world.actors.find((actor) =>
        actor.isAt(this.getPosition(x, y)));
      if (actor) {
        actor.target = [this.world.hero.x, this.world.hero.y];
      }
    });
    this.world.engine.unlock();
  }

  /**
   * Attack the target actor from afar.
   *
   * @param {Actor} actor
   * @memberof Hero
   */
  fireAndUnlock(actor) {
    let damage = this.damage + RNG.getUniformInt(0, 1);
    damage *= this.hasFeather ? 2 : 1;
    this.world.log.unshift(` You shot ${actor.name}.`);
    actor.weaken(damage);
    this.bullets -= 1;
    this.target = null;
    this.world.engine.unlock();
  }

  /**
   * Opens the game over screen.
   *
   * @memberof Actor
   */
  kill() {
    this.died = true;
  }
}
