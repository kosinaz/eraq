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
    this.char = '@';
    this.name = 'you';
    this.health = 5;
    this.damage = 1;
    this.speed = 3;
    this.hasPistol = false;
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
      this.world.log.unshift('');
      actor.weaken(this.damage + RNG.getUniformInt(0, 1));
      this.target = null;
    } else {
      this.x = this.path[1][0];
      this.y = this.path[1][1];
      const char = this.world.items.get(this.position);
      if (['+', '⊠', '⌐'].includes(char)) {
        if (char === '+' && this.health < 5) {
          this.world.items.delete(this.position);
          this.health += 1;
          this.world.log.unshift(` you used a medkit `);
        } else if (char === '⊠' && this.bullets < 12) {
          this.world.items.delete(this.position);
          const bullets = RNG.getUniformInt(2, 6);
          this.bullets += bullets;
          this.world.log.unshift(` you picked up ${bullets} bullets `);
        } else if (char === '⌐' && (!this.hasPistol || this.bullets < 12)) {
          this.world.items.delete(this.position);
          const bullets = RNG.getUniformInt(2, 6);
          this.hasPistol = true;
          this.damage = 3;
          this.bullets += bullets;
          this.world.log.unshift(
              ` you picked up a pistol with ${bullets} bullets `,
          );
        }
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
    this.world.log.unshift(' you fired your pistol ');
    actor.weaken(this.damage + RNG.getUniformInt(0, 3));
    this.bullets -= 1;
    this.target = null;
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
   * Opens the game over screen.
   *
   * @memberof Actor
   */
  kill() {
    this.died = true;
  }
}
