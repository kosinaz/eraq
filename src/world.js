import Speed from '../lib/rot/scheduler/speed.js';
import {Engine, RNG} from '../lib/rot/index.js';
import Hero from './hero.js';
import Boss from './boss.js';
import Bat from './bat.js';
import Tarantula from './tarantula.js';
import Snake from './snake.js';
import Crocodile from './crocodile.js';
import Dog from './dog.js';
import Jaguar from './jaguar.js';
import Monkey from './monkey.js';
import Lizard from './lizard.js';
import Eagle from './eagle.js';
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
    this.rivals = 7;
    this.animalOrder = RNG.shuffle(
        ['snake', 'crocodile', 'dog', 'jaguar', 'monkey', 'lizard', 'eagle'],
    );
    let arena = new Arena(52, 25);
    arena.create((x, y, value) => {
      if (value) {
        this.map.set(`${x},${y},0`, RNG.getItem(['~', '≈', '≋']));
      } else if ((x === 3 || x === 48) && (y % 6 === 3)) {
        this.map.set(`${x},${y},0`, RNG.getItem(['̬ ', 'ˬ', '˯']));
      } else if (!RNG.getUniformInt(0, 2)) {
        if (x === 1 || x === 50 || y === 1 || y === 23) {
          this.map.set(`${x},${y},0`, RNG.getItem(['~', '≈', '≋']));
        } else {
          this.map.set(`${x},${y},0`, RNG.getItem(['♣', '♠']));
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
        const roomType = RNG.getItem(['tarantula', 'bat', this.animalOrder[z]]);
        for (let j = 0; j < RNG.getUniformInt(1, z); j += 1) {
          const x = RNG.getUniformInt(rooms[i].getLeft(), rooms[i].getRight());
          const y = RNG.getUniformInt(rooms[i].getTop(), rooms[i].getBottom());
          const actor = this.actors.find(
              (actor) => actor.x === x && actor.y === y,
          );
          if (!actor) {
            let foe = null;
            if (roomType === 'tarantula') {
              foe = new Tarantula(this, `${x},${y},${z}`);
            } else if (roomType === 'bat') {
              foe = new Bat(this, `${x},${y},${z}`);
            } else if (roomType === 'snake') {
              foe = new Snake(this, `${x},${y},${z}`);
            } else if (roomType === 'crocodile') {
              foe = new Crocodile(this, `${x},${y},${z}`);
            } else if (roomType === 'dog') {
              foe = new Dog(this, `${x},${y},${z}`);
            } else if (roomType === 'jaguar') {
              foe = new Jaguar(this, `${x},${y},${z}`);
            } else if (roomType === 'monkey') {
              foe = new Monkey(this, `${x},${y},${z}`);
            } else if (roomType === 'lizard') {
              foe = new Lizard(this, `${x},${y},${z}`);
            } else if (roomType === 'eagle') {
              foe = new Eagle(this, `${x},${y},${z}`);
            }
            if (foe) {
              this.actors.push(foe);
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
    const spawns = RNG.shuffle([
      '3,3,0',
      '3,12,0',
      '3,21,0',
      '26,3,0',
      '26,21,0',
      '49,3,0',
      '49,12,0',
      '49,21,0',
    ]);
    for (let i = 0; i < 7; i += 1) {
      this.map.set(spawns[i], '˯');
      this.actors.push(new Rival(
          this,
          spawns[i],
          ['Ⓟ', 'Ⓨ', 'Ⓑ', 'Ⓖ', 'Ⓥ', 'Ⓦ', 'Ⓞ'][i],
          ['Pink', 'Yellow', 'Blue', 'Green', 'Violet', 'White', 'Orange'][i],
      ));
    }
    this.hero = new Hero(this, spawns[7]);
    this.map.set(spawns[7], '˯');
    this.actors.push(new Boss(this, `26,14,8`));
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
