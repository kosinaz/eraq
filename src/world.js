import Speed from '../lib/rot/scheduler/speed.js';
import {Engine, RNG} from '../lib/rot/index.js';
import Hero from './hero.js';
import Boss from './boss.js';
import Snake from './snake.js';
import Bat from './bat.js';
import Arena from '../lib/rot/map/arena.js';
import Digger from '../lib/rot/map/digger.js';
import Rival from './rival.js';

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
    this.downs = [[26, 12]];
    this.actors = [];
    let arena = new Arena(52, 25);
    arena.create((x, y, value) => {
      if (value) {
        this.map.set(`${x},${y},0`, RNG.getItem(['~','≈','≋']));
      } else if ((x === 3 || x === 48) && (y % 6 === 3)) {
        this.map.set(`${x},${y},0`, RNG.getItem(['̬ ', 'ˬ', '˯']));
      } else if (!RNG.getUniformInt(0, 2)) {
        if (x === 1 || x === 50 || y === 1 || y === 23) {
          this.map.set(`${x},${y},0`, RNG.getItem(['~','≈','≋']));
        } else {
          this.map.set(`${x},${y},0`, RNG.getItem(['♣','♠']));
        }
      } else {
        this.map.set(`${x},${y},0`, RNG.getItem(['̬ ', 'ˬ', '˯']));
      }
    });
    const digger = new Digger(52, 25);
    for (let z = 1; z < 8; z += 1) {
      digger.create((x, y, value) => {
        if (value) {
          this.map.set(`${x},${y},${z}`, '#');
        } else {
          this.map.set(`${x},${y},${z}`, RNG.getItem(['‧', '⋅', '∙']));
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
      arena = new Arena(13, 11);
      arena.create((x, y, value) => {
        if (value) {
          this.map.set(`${x + 20},${y + 7},8`, '#');
          this.map.set(`${x + 20},${y + 7},0`, x % 2 || y % 2 ? '∙' : '#');
        } else {
          this.map.set(`${x + 20},${y + 7},8`, '•');
          this.map.set(`${x + 20},${y + 7},0`, '∙');
        }
      });
      this.ups[z] = rooms[0].getCenter();
      this.downs[z] = rooms[rooms.length - 1].getCenter();
      this.map.set(`${this.ups[z][0]},${this.ups[z][1]},${z}`, '<');
      this.map.set(`${this.downs[z][0]},${this.downs[z][1]},${z}`, '>');
    }
    this.map.set(`26,9,8`, '<');
    this.ups.push([26, 9]);
    const foe = new Boss(this, `26,14,8`);
    this.actors.push(foe);
    // this.hero = new Hero(this, `26,7,8`);
    this.hero = new Hero(this, `13,12,0`);
    let rivals = [];
    for (let i = 0; i < 7; i += 1) {
      let rival = new Rival(
        this,
        `0,0,0`,
        ['Ⓟ', 'Ⓨ', 'Ⓑ', 'Ⓖ', 'Ⓥ', 'Ⓦ', 'Ⓞ'][i],
        ['Pink', 'Yellow', 'Blue', 'Green', 'Violet', 'White', 'Orange'][i],
      );
      rivals.push(rival);
      this.actors.push(rival);
    }
    rivals.push(this.hero);
    rivals = RNG.shuffle(rivals);
    for (let y = 0; y < 4; y += 1) {
      rivals[y].x = 3;
      rivals[y].y = 3 + y * 6;
      rivals[y].target = [rivals[y].x, rivals[y].y];
      rivals[y + 4].x = 48;
      rivals[y + 4].y = 3 + y * 6;      
      rivals[y + 4].target = [rivals[y + 4].x, rivals[y + 4].y];
    }
    this.map.set(`${this.downs[0][0]},${this.downs[0][1]},0`, '>');
    // this.items.set(`14,12,0`, '+');
    // this.items.set(`15,12,0`, '+');
    // this.items.set(`16,12,0`, '⌐');
    // this.items.set(`17,12,0`, '⊠');
    // // this.items.set(`26,8,8`, '⌐');
    // // this.items.set(`26,9,8`, '⊠');
    // this.map.set(`14,12,0`, '˯');
    // this.map.set(`15,12,0`, '˯');
    // this.map.set(`16,12,0`, '˯');
    // this.map.set(`17,12,0`, '˯');
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
