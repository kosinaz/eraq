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
    this.turns = 0;
    this.char = char;
    this.name = name;
    this.health = 10;
    this.damage = 1;
    this.speed = 3;
    this.hasPistol = false;
    this.hasFeather = false;
    this.medkits = 0;
    this.bullets = 0;
    this.rival = true;
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
      this.target = null;
      return;
    }
    this.turns += 1;
    if (this.turns > 50 && !this.hasPistol) {
      this.turns = 0;
      this.target = this.world.downs[this.z];
      this.moveToTarget();
      return;
    }
    if (this.health < 5 && this.medkits > 0) {
      this.health = 10;
      this.medkits -= 1;
      if (this.isVisible()) {
        this.world.log[0] += ` ${this.name} used 1+.`;
      }
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
      } else if (char === '␦' && !this.hasWhip && !this.hasPistol) {
        this.world.items.delete(this.position);
        this.hasWhip = true;
        this.damage = 2;
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
    let victim = null;
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
      // console.log(this.world.hero.isAt(position));
      if (this.world.hero.isAt(position)) {
        if ((this.hasPistol && this.bullets > 0)) {
          newTarget = [x, y];
          victim = this.world.hero;
          // console.log(this.name, 'found hero');
          return;
        }
      }
      const actor = this.world.actors.find((actor) =>
        actor.isAt(position));
      if (actor && actor !== this && this.hasPistol && this.bullets > 0) {
        newTarget = [actor.x, actor.y];
        victim = actor;
        // console.log(this.name, 'found actor');
        return;
      }
    });
    if (this.hasPistol && !newTarget) {
      newTarget = [this.world.ups[this.z][0] + 1, this.world.ups[this.z][1]];
    }
    if (newTarget) {
      this.target = newTarget;
      // console.log(this.name, 'moves to new target');
    } else if (
      !this.target || this.isAt(`${this.target[0]},${this.target[1]},${this.z}`)
    ) {
      this.target = RNG.getItem(floors);
      // console.log(this.name, 'moves randomly to', this.target);
    }
    if (victim && this.hasPistol && this.bullets > 0) {
      this.fire(victim);
    } else {
      this.moveToTarget();
    }
  }

  /**
   * Attack the target actor from afar.
   *
   * @param {Actor} actor
   * @memberof Rival
   */
  fire(actor) {
    let damage = this.damage + RNG.getUniformInt(0, 1);
    damage *= this.hasFeather ? 2 : 1;
    if (this.isVisible()) {
      this.world.log[0] += ` ${this.name} shot ${actor.name}.`;
    } else {
      this.world.log[0] += ' You heard a shot.';
    }
    actor.weaken(damage);
    // this.bullets -= 1;
    this.target = null;
  }

  /**
   * Kills the actor.
   *
   * @param {boolean} hero
   * @memberof Actor
   */
  kill(hero) {
    super.kill();
    if (this.hasPistol) {
      this.world.items.set(this.position, '⌐');
    } else if (this.hasWhip) {
      this.world.items.set(this.position, '␦');
    } else if (this.medkits > 0) {
      this.world.items.set(this.position, '+');
    } else if (this.bullets > 5) {
      this.world.items.set(this.position, '⊠');
    }
    if (!hero) {
      return;
    }
    this.world.scene.game.rivalsound.play();
    this.world.stats.kills.rival += 1;
    this.world.stats.point += 50;
  }
}
