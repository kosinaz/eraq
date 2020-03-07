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
import EllerMaze from '../lib/rot/map/iceymaze.js';
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
    this.switched = 0;
    this.animalOrder = RNG.shuffle(
        ['snake', 'crocodile', 'dog', 'jaguar', 'monkey', 'lizard', 'eagle'],
    );
    const eller = new EllerMaze(52, 25);
    eller.create((x, y, value) => {
      if (x < 2 || x > 49 || y < 2 || y > 22) {
        if (value) {
          this.map.set(`${x},${y},0`, RNG.getItem(['~', '≈', '≋']));
        } else {
          this.map.set(`${x},${y},0`, RNG.getItem(['̬ ', 'ˬ', '˯']));
        }
      } else {
        if (value) {
          this.map.set(`${x},${y},0`, RNG.getItem(['♣', '♠', '̬ ']));
        } else {
          this.map.set(`${x},${y},0`, RNG.getItem(['̬ ', 'ˬ', '˯']));
          if (!RNG.getUniformInt(0, 50)) {
            this.items.set(`${x},${y},0`, RNG.getItem(['␦', '⊠', '+']));
          }
        }
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
      let floors = [];
      const rooms = digger.getRooms();
      for (let i = 1; i < rooms.length - 2; i += 1) {
        for (let x = rooms[i].getLeft(); x < rooms[i].getRight(); x += 1) {
          for (let y = rooms[i].getTop(); y < rooms[i].getBottom(); y += 1) {
            floors.push(`${x},${y},${z}`);
          }
        }
      }
      floors = RNG.shuffle(floors);
      for (let i = 0; i < 3; i += 1) {
        if (!floors.length) {
          break;
        }
        if (this.animalOrder[z - 1] === 'snake') {
          this.map.set(floors.pop(), '𝔰');
        } else if (this.animalOrder[z - 1] === 'crocodile') {
          this.map.set(floors.pop(), '𝔠');
        } else if (this.animalOrder[z - 1] === 'dog') {
          this.map.set(floors.pop(), '𝔡');
        } else if (this.animalOrder[z - 1] === 'jaguar') {
          this.map.set(floors.pop(), '𝔧');
        } else if (this.animalOrder[z - 1] === 'monkey') {
          this.map.set(floors.pop(), '𝔪');
        } else if (this.animalOrder[z - 1] === 'lizard') {
          this.map.set(floors.pop(), '𝔩');
        } else if (this.animalOrder[z - 1] === 'eagle') {
          this.map.set(floors.pop(), '𝔢');
        }
      }
      for (let i = 0; i < 3; i += 1) {
        if (!floors.length) {
          break;
        }
        if (this.animalOrder[z - 1] === 'snake') {
          this.actors.push(new Snake(this, floors.pop()));
        } else if (this.animalOrder[z - 1] === 'crocodile') {
          this.actors.push(new Crocodile(this, floors.pop()));
        } else if (this.animalOrder[z - 1] === 'dog') {
          this.actors.push(new Dog(this, floors.pop()));
        } else if (this.animalOrder[z - 1] === 'jaguar') {
          this.actors.push(new Jaguar(this, floors.pop()));
        } else if (this.animalOrder[z - 1] === 'monkey') {
          this.actors.push(new Monkey(this, floors.pop()));
        } else if (this.animalOrder[z - 1] === 'lizard') {
          this.actors.push(new Lizard(this, floors.pop()));
        } else if (this.animalOrder[z - 1] === 'eagle') {
          this.actors.push(new Eagle(this, floors.pop()));
        }
      }
      if (floors.length) {
        this.actors.push(new Tarantula(this, floors.pop()));
      }
      if (floors.length) {
        this.actors.push(new Bat(this, floors.pop()));
      }
      if (floors.length) {
        this.actors.push(new Bat(this, floors.pop()));
      }
      if (floors.length) {
        this.items.set(floors.pop(), '+');
      }
      if (floors.length) {
        this.items.set(floors.pop(), '⌐');
      }
      if (floors.length) {
        this.items.set(floors.pop(), '␦');
      }
      if (floors.length) {
        this.items.set(floors.pop(), RNG.getItem(['⊠', '+']));
      }
      const arena = new Arena(13, 11);
      arena.create((x, y, value) => {
        if (value) {
          this.map.set(`${x + 20},${y + 7},8`, '#');
          this.map.set(`${x + 20},${y + 7},0`, x % 2 || y % 2 ? '∙' : '#');
          this.items.delete(`${x + 20},${y + 7},0`);
        } else {
          this.map.set(`${x + 20},${y + 7},8`, '∙');
          this.map.set(`${x + 20},${y + 7},0`, '∙');
        }
      });
      this.map.set(`22,9,8`, '𝔰');
      this.map.set(`30,9,8`, '𝔠');
      this.map.set(`22,12,8`, '𝔡');
      this.map.set(`30,12,8`, '𝔧');
      this.map.set(`22,15,8`, '𝔪');
      this.map.set(`26,15,8`, '𝔩');
      this.map.set(`30,15,8`, '𝔢');
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
    this.actors.push(new Boss(this, `26,16,8`));
    this.map.set(`${this.downs[0][0]},${this.downs[0][1]},0`, '>');
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
