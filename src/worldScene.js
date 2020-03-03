import Scene from './scene.js';
import World from './world.js';

/**
 * Represents the scene that displays the ingame world.
 *
 * @export
 * @class WorldScene
 * @extends {Scene}
 */
export default class WorldScene extends Scene {
  /**
   * Starts the game.
   *
   * @memberof WorldScene
   */
  start() {
    super.start();
    this.selected = 0;
    this.music = new Audio('./music/.ogg');
    this.music.loop = true;
    this.music.play();
    this.world = new World(this);
    this.world.create();
    this.mouseX = -1;
    this.mouseY = -1;
    this.game.tiled = true;
    this.game.display.setOptions(
      this.game.tiled ? this.game.tileOptions : this.game.rectOptions,
    );
    document.body.removeChild(this.game.canvas);
    this.game.canvas = this.game.display.getContainer();
    document.body.appendChild(this.game.canvas);
    this.update();
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof WorldScene
   */
  update() {
    this.game.display.clear();
    if (this.world.hero.died) {
      this.switchTo(this.game.failScene);
      return;
    }
    this.world.hero.explored.forEach((position) => {
      const p = position.split(',');
      if (+p[2] === this.world.hero.z) {
        const char = this.world.map.get(position);
        let actorChar = ' ';
        let color = this.game.tiled ? 'rgba(10, 10, 10, 0.75)' : '#888';
        let bg = '#000';
        if (+p[0] === this.mouseX &&
            +p[1] === this.mouseY &&
            this.world.hero.isPassable(+p[0], +p[1])) {
          if (this.game.tiled) {
            color = 'rgba(255, 255, 255, 0.25)';
          } else {
            bg = '#aaa';
          }
        }
        if (this.world.hero.fov.has(`${p[0]},${p[1]}`)) {
          color = this.game.tiled ? 'transparent' : '#ccc';
          if (+p[0] === this.mouseX &&
              +p[1] === this.mouseY &&
              this.world.hero.isPassable(+p[0], +p[1]) &&
              this.game.tiled) {
            color = 'rgba(255, 255, 255, 0.5)';
          }
          const actor = this.world.actors.find((actor) => actor.isAt(position));
          if (actor) {
            actorChar = actor.char;
          }
          if (this.world.hero.isAt(position)) {
            actorChar = '@';
          }
        }
        if (this.game.tiled) {
          this.game.display.draw(
              +p[0],
              +p[1],
              [char, actorChar],
              [color, color],
              [bg, 'transparent'],
          );
        } else {
          this.game.display.draw(+p[0], +p[1], [char, actorChar]);
        }
      }
    });
    let color = 'transparent';
    let bg = null;
    if (this.mouseX === 1 && this.mouseY === 26) {
      if (this.game.tiled) {
        color = 'rgba(255, 255, 255, 0.25)';
      } else {
        bg = '#aaa';
      }
    }
    this.game.display.draw(1, 26, '@', this.game.tiled ? color : null, bg);
    this.game.display.drawText(
        2, 26, '♥♥♥♥♥'.substr(0, this.world.hero.health) +
        '♡♡♡♡♡'.substr(this.world.hero.health),
    );
    color = 'transparent';
    bg = null;
    if (this.world.hero.hasPistol) {
      this.game.display.draw(9, 26, '⌐', this.game.tiled ? color : null);
    }
    for (let i = 0; i < this.world.hero.bullets; i += 1) {
      this.game.display.draw(10 + i, 26, '⁍', this.game.tiled ? color : null);
    }
    if (this.mouseX === 78 && this.mouseY === 26) {
      if (this.game.tiled) {
        color = 'rgba(255, 255, 255, 0.25)';
      } else {
        bg = '#aaa';
      }
    }
    this.game.display.draw(
        78,
        26,
        this.music.muted ? '🕨' : '🕪',
        this.game.tiled ? color : null, bg,
    );
    this.game.display.drawText(0, 28, this.world.log[0].slice(-80));
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    super.handleEvent(event);
    const char = this.world.map.get(this.world.hero.position);
    if (event.type === 'mouseup') {
      this.world.hero.target = null;
    } else if (event.type === 'mousemove') {
      this.mouseX = this.eventX;
      this.mouseY = this.eventY;
      this.update();
      return;
    } else if (event.type === 'mousedown') {
      if (this.eventX === 78 && this.eventY === 26) {
        this.music.muted = !this.music.muted;
        this.update();
        return;
      }
      if (this.eventX === 1 && this.eventY === 26) {
        this.game.tiled = !this.game.tiled;
        this.game.display.setOptions(
          this.game.tiled ? this.game.tileOptions : this.game.rectOptions,
        );
        document.body.removeChild(this.game.canvas);
        this.game.canvas = this.game.display.getContainer();
        document.body.appendChild(this.game.canvas);
        this.update();
        return;
      }
      if (this.world.hero.isAtXY(this.eventX, this.eventY)) {
        if (char === '<') {
          this.world.hero.z -= 1;
          this.world.hero.x = this.world.downs[this.world.hero.z][0];
          this.world.hero.y = this.world.downs[this.world.hero.z][1];
          this.world.engine.unlock();
          return;
        }
        if (char === '>') {
          this.world.hero.z += 1;
          this.world.hero.x = this.world.ups[this.world.hero.z][0];
          this.world.hero.y = this.world.ups[this.world.hero.z][1];
          this.world.engine.unlock();
          return;
        }
      }
      const actor = this.world.getActorAt(
          `${this.eventX},${this.eventY},${this.world.hero.z}`,
      );
      if (actor &&
          this.world.hero.hasPistol &&
          this.world.hero.bullets > 0 &&
          (Math.abs(this.world.hero.x - this.eventX) > 1 ||
          Math.abs(this.world.hero.y - this.eventY) > 1)
      ) {
        this.world.hero.fireAndUnlock(actor);
      } else {
        this.world.hero.target = [this.eventX, this.eventY];
        this.world.hero.moveToTargetAndUnlock();
      }
    } else if (event.type === 'keydown') {
      let x = this.world.hero.x;
      let y = this.world.hero.y;
      if (event.keyCode === 77) {
        this.music.muted = !this.music.muted;
        this.update();
        return;
      }
      if (event.keyCode === 84) {
        this.game.tiled = !this.game.tiled;
        this.game.display.setOptions(
          this.game.tiled ? this.game.tileOptions : this.game.rectOptions,
        );
        document.body.removeChild(this.game.canvas);
        this.game.canvas = this.game.display.getContainer();
        document.body.appendChild(this.game.canvas);
        this.update();
        return;
      }
      if (event.keyCode === 13) {
        if (char === '<') {
          this.world.hero.z -= 1;
          this.world.hero.x = this.world.downs[this.world.hero.z][0];
          this.world.hero.y = this.world.downs[this.world.hero.z][1];
          this.world.hero.target = null;
          this.world.engine.unlock();
          return;
        }
        if (char === '>') {
          this.world.hero.z += 1;
          this.world.hero.x = this.world.ups[this.world.hero.z][0];
          this.world.hero.y = this.world.ups[this.world.hero.z][1];
          this.world.hero.target = null;
          this.world.engine.unlock();
          return;
        }
      }
      if ([37, 65, 100].includes(event.keyCode)) {
        x -= 1;
      } else if ([38, 87, 104].includes(event.keyCode)) {
        y -= 1;
      } else if ([39, 68, 102].includes(event.keyCode)) {
        x += 1;
      } else if ([40, 83, 98].includes(event.keyCode)) {
        y += 1;
      } else if (event.keyCode === 103) {
        x -= 1;
        y -= 1;
      } else if (event.keyCode === 105) {
        x += 1;
        y -= 1;
      } else if (event.keyCode === 99) {
        x += 1;
        y += 1;
      } else if (event.keyCode === 97) {
        x -= 1;
        y += 1;
      }
      this.world.hero.target = [x, y];
      this.world.hero.moveToTargetAndUnlock();
    }
  }
}
