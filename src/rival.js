import Actor from './actor.js';
import {RNG} from '../lib/rot/index.js';
import PreciseShadowcasting from '../lib/rot/fov/precise-shadowcasting.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Rival
 * @extends {Actor}
 */
export default class Rival extends Actor {
  /**
   *Creates an instance of Rival.
   * @param {*} world
   * @param {*} position
   * @param {*} char
   * @param {*} name
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
    this.target = [this.x, this.y];
    this.ps = new PreciseShadowcasting(this.isPassable.bind(this));
    this.world.scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Rival
   */
  act() {
    let char = this.world.map.get(this.position);
    if (char === '>') {
      this.z += 1;
      this.x = this.world.ups[this.z][0];
      this.y = this.world.ups[this.z][1];
      return;
    }
    char = this.world.items.get(this.position);
    if (char) {
      if (char === '⤁') {
        this.world.items.delete(this.position);
        this.hasFeather = true;
        this.speed = 6;
        // this.world.log.unshift(` YOU HAVE THE GOLDEN FEATHER! `);
      } else if (char === '+' && this.medkits < 5) {
        this.world.items.delete(this.position);
        this.medkits += 1;
        // this.world.log.unshift(` you picked up a medkit `);
      } else if (char === '⊠') {
        this.world.items.delete(this.position);
        const bullets = RNG.getUniformInt(2, 6);
        this.bullets += bullets;
        // this.world.log.unshift(` you picked up ${bullets} bullets `);
      } else if (char === '⌐') {
        this.world.items.delete(this.position);
        const bullets = RNG.getUniformInt(2, 6);
        this.hasPistol = true;
        this.damage = 3;
        this.bullets += bullets;
        // this.world.log.unshift(
        //   ` you picked up a pistol with ${bullets} bullets `,
        // );
      }
    }
    let newTarget = null;
    const floors = [];
    this.ps.compute(this.x, this.y, 11, (x, y) => {
      if (newTarget) {
        return;
      }
      const position = `${x},${y},${this.z}`;
      let char = this.world.map.get(position);
      if (char === '>') {
        newTarget = [x, y];
        // console.log(this.name, 'found stairs');
        return;
      }
      if (['̬ ', 'ˬ', '˯', '‧', '⋅', '∙'].includes(char)) {
        floors.push([x, y]);
      }
      char = this.world.items.get(position);
      if (char && (char !== '+' || this.medkits < 5)) {
        newTarget = [x, y];
        return;
      }
      if (this.world.hero.isAt(position)) {
        newTarget = [x, y];
        // console.log(this.name, 'found hero');
        return;
      }
      const actor = this.world.actors.find((actor) =>
        actor.isAt(position));
      if (actor && actor !== this) {
        newTarget = [actor.x, actor.y];
        // console.log(this.name, 'found actor');
        return;
      }
    });
    if (newTarget) {
      this.target = newTarget;
      // console.log(this.name, 'moves to new target');
    } else if (
      !this.target || this.isAt(`${this.target[0]},${this.target[1]},${this.z}`)
    ) {
      this.target = RNG.getItem(floors);
      // console.log(this.name, 'moves randomly to', this.target);
    }
    this.moveToTarget();
  }

  /**
   * Kills the actor.
   *
   * @memberof Actor
   */
  kill() {
    this.world.log.unshift(` ${this.name} died ${--this.world.rivals} left `);
    this.world.actors.splice(this.world.actors.indexOf(this), 1);
    this.world.scheduler.remove(this);
  }
}
