import Speed from '../lib/rot/scheduler/speed.js';
import {Engine, RNG} from '../lib/rot/index.js';
import Hero from './hero.js';
import Snake from './snake.js';
import Bat from './bat.js';
import Arena from '../lib/rot/map/arena.js';
import Digger from '../lib/rot/map/digger.js';

/**
 * Represent the ingame world.
 *
 * @export
 * @class World
 */
export default class World {
  /**
   * Creates an instance of World.
   *
   * @param {Scene} scene
   * @memberof World
   */
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Creates the content of the world.
   *
   * @memberof World
   */
  create() {
    this.scheduler = new Speed();
    this.engine = new Engine(this.scheduler);
    this.log = [''];
    this.map = new Map();
    this.items = new Map();
    this.ups = [[]];
    this.downs = [[39, 12]];
    this.actors = [];
    const arena = new Arena(52, 25);
    arena.create((x, y, value) => {
      if (value) {
        this.map.set(`${x},${y},0`, '~');
      } else if (!RNG.getUniformInt(0, 5)) {
        if (x === 1 || x === 50 || y === 1 || y === 23) {
          this.map.set(`${x},${y},0`, '~');
        } else {
          this.map.set(`${x},${y},0`, '♣');
        }
      } else {
        this.map.set(`${x},${y},0`, RNG.getItem(['̬ ', 'ˬ', '˯']));
      }
    });
    const digger = new Digger(52, 25);
    for (let z = 1; z < 10; z += 1) {
      digger.create((x, y, value) => {
        if (value) {
          this.map.set(`${x},${y},${z}`, '#');
        } else {
          this.map.set(`${x},${y},${z}`, '‧');
        }
      });
      const rooms = digger.getRooms();
      for (let i = 1; i < rooms.length - 2; i += 1) {
        const roomType = RNG.getItem(['snake', 'bat']);
        for (let j = 0; j < RNG.getUniformInt(1, z); j += 1) {
          const x = RNG.getUniformInt(rooms[i].getLeft(), rooms[i].getRight());
          const y = RNG.getUniformInt(rooms[i].getTop(), rooms[i].getBottom());
          const actor = this.actors.find(
              (actor) => actor.x === x && actor.y === y,
          );
          if (!actor) {
            if (roomType === 'snake') {
              const foe = new Snake(this, `${x},${y},${z}`);
              this.actors.push(foe);
              this.target = null;
            } else if (roomType === 'bat') {
              const foe = new Bat(this, `${x},${y},${z}`);
              this.actors.push(foe);
              this.target = null;
            }
          }
        }
        for (let j = 0; j < RNG.getUniformInt(1, 5); j += 1) {
          const x = RNG.getUniformInt(rooms[i].getLeft(), rooms[i].getRight());
          const y = RNG.getUniformInt(rooms[i].getTop(), rooms[i].getBottom());
          if (!RNG.getUniformInt(0, 10)) {
            this.items.set(`${x},${y},${z}`, '+');
          } else if (!RNG.getUniformInt(0, 20)) {
            this.items.set(`${x},${y},${z}`, '⊠');
          } else if (!RNG.getUniformInt(0, 30)) {
            this.items.set(`${x},${y},${z}`, '⌐');
          }
        }
      }
      this.ups[z] = rooms[0].getCenter();
      this.downs[z] = rooms[rooms.length - 1].getCenter();
      this.map.set(`${this.ups[z][0]},${this.ups[z][1]},${z}`, '<');
      this.map.set(`${this.downs[z][0]},${this.downs[z][1]},${z}`, '>');
    }
    this.hero = new Hero(this, `13,12,0`);
    this.map.set(`13,12,0`, '˯');
    this.map.set(`${this.downs[0][0]},${this.downs[0][1]},0`, '>');
    this.items.set(`14,12,0`, '+');
    this.items.set(`15,12,0`, '⊠');
    this.items.set(`16,12,0`, '⊠');
    this.items.set(`17,12,0`, '⊠');
    this.items.set(`18,12,0`, '⊠');
    this.items.set(`19,12,0`, '⌐');
    this.map.set(`14,12,0`, '˯');
    this.map.set(`15,12,0`, '˯');
    this.map.set(`16,12,0`, '˯');
    this.map.set(`17,12,0`, '˯');
    this.map.set(`18,12,0`, '˯');
    this.map.set(`19,12,0`, '˯');
    this.engine.start();
  }

  /**
   * Get the actor at the given position.
   *
   * @param {string} position
   * @return {Actor}
   * @memberof World
   */
  getActorAt(position) {
    return this.actors.find((actor) => actor.isAt(position));
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof World
   */
  update() {
    this.scene.update();
  }
}
