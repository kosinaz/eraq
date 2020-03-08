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
    super.start(this.game.tileOptions);
    this.selected = 0;
    this.world = new World(this);
    this.world.create();
    this.mouseX = -1;
    this.mouseY = -1;
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof WorldScene
   */
  update() {
    this.game.display.clear();
    if (this.world.hero.hasFeather && this.world.hero.z === 0) {
      this.switchTo(this.game.winScene);
      return;
    }
    if (this.world.hero.died) {
      this.game.mortem = this.world.log;
      this.switchTo(this.game.failScene);
      return;
    }
    this.world.hero.explored.forEach((position) => {
      const p = position.split(',');
      if (+p[2] === this.world.hero.z) {
        let char = this.world.map.get(position);
        const itemChar = this.world.items.get(position) || ' ';
        let actorChar = ' ';
        let color = this.game.tiled ? 'rgba(10, 10, 10, 0.75)' : '#444';
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
            actorChar = 'Ⓡ';
          }
        }
        if (this.game.tiled) {
          this.game.display.draw(
              +p[0],
              +p[1],
              [char, itemChar, actorChar],
              [color, color, color],
              [bg, 'transparent', 'transparent'],
          );
        } else {
          char = itemChar === ' ' ? char : itemChar;
          char = actorChar === ' ' ? char : actorChar;
          this.game.display.draw(+p[0], +p[1], char, color, bg);
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
    this.game.display.draw(1, 25, 'Ⓡ', this.game.tiled ? color : null, bg);
    if (this.world.hero.hasFeather) {
      this.game.display.drawText(
          2, 25, '♥♥♥♥♥♥♥♥♥♥'.substr(0, this.world.hero.health) +
          '♡♡♡♡♡♡♡♡♡♡'.substr(this.world.hero.health),
          'rgba(255, 255, 0, 0.33)',
      );
      this.game.display.draw(12, 26, '⤁', this.game.tiled ? color : null);
    } else {
      this.game.display.drawText(
          2, 25, '♥♥♥♥♥♥♥♥♥♥'.substr(0, this.world.hero.health) +
          '♡♡♡♡♡♡♡♡♡♡'.substr(this.world.hero.health),
      );
    }
    this.game.display.drawText(
        13, 25, '+++++'.substr(0, this.world.hero.medkits),
    );
    color = 'transparent';
    bg = null;
    if (this.world.hero.hasPistol) {
      this.game.display.draw(26, 25, '⌐', this.game.tiled ? color : null);
    } else if (this.world.hero.hasWhip) {
      this.game.display.draw(26, 25, '␦', this.game.tiled ? color : null);
    }
    if (this.world.hero.bullets > 0) {
      for (let i = 0; i < ((this.world.hero.bullets % 6) || 6); i += 1) {
        this.game.display.draw(25 - i, 25, '⁍', this.game.tiled ? color : null);
      }
      for (let i = 0; i < ~~((this.world.hero.bullets - 1) / 6); i += 1) {
        this.game.display.draw(27 + i, 25, '⊠', this.game.tiled ? color : null);
      }
    }
    if (this.mouseX === 50 && this.mouseY === 25) {
      if (this.game.tiled) {
        color = 'rgba(255, 255, 255, 0.25)';
      } else {
        bg = '#aaa';
      }
    }
    this.game.display.draw(
        50,
        25,
        this.game.music.muted ? '🕨' : '🕪',
        this.game.tiled ? color : null, bg,
    );
    this.game.display.drawText(0, 26, this.world.log[0], null, 50);
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
      if (this.eventX === 50 && this.eventY === 25) {
        this.game.music.muted = !this.game.music.muted;
        this.update();
        return;
      }
      if (this.eventX === 1 && this.eventY === 25) {
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
      if (this.eventX > 1 &&
          this.eventX < 19 &&
          this.eventY === 25 &&
          this.world.hero.medkits > 0 &&
          this.world.hero.health < 10) {
        this.world.hero.medkits -= 1;
        this.world.hero.health = 10;
        this.world.log.unshift(` You used 1+.`);
        this.world.engine.unlock();
        return;
      }
      if (this.world.hero.isAtXY(this.eventX, this.eventY)) {
        if (char === '<') {
          this.world.hero.z -= 1;
          this.world.hero.x = this.world.downs[this.world.hero.z][0];
          this.world.hero.y = this.world.downs[this.world.hero.z][1];
          this.world.log.unshift(
              ` You returned to level ${this.world.hero.z}.`,
          );
          this.world.engine.unlock();
          return;
        }
        if (char === '>') {
          this.world.hero.z += 1;
          this.world.hero.x = this.world.ups[this.world.hero.z][0];
          this.world.hero.y = this.world.ups[this.world.hero.z][1];
          if (this.world.hero.z === 8) {
            const muted = this.game.music.muted;
            this.game.music.pause();
            this.game.music = this.game.bossmusic;
            this.game.music.play();
            this.game.music.muted = muted;
            this.world.log.unshift(
                ' You see a horrible Doubleheaded snake!',
            );
          } else {
            this.world.log.unshift(
                ` You went down to level ${this.world.hero.z}.`,
            );
          }
          this.world.engine.unlock();
          return;
        }
        if (this.world.hero.medkits > 0 && this.world.hero.health < 10) {
          this.world.hero.medkits -= 1;
          this.world.hero.health = 10;
          this.world.log.unshift(` You used 1+.`);
          this.world.engine.unlock();
        }
      }
      const actor = this.world.getActorAt(
          `${this.eventX},${this.eventY},${this.world.hero.z}`,
      );
      if (actor &&
          this.world.hero.hasPistol &&
          this.world.hero.bullets > 0 &&
          this.world.hero.fov.has(`${this.eventX},${this.eventY}`) &&
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
          this.world.log.unshift(
              ` You returned to level ${this.world.hero.z}.`,
          );
          this.world.hero.target = null;
          this.world.engine.unlock();
          return;
        }
        if (char === '>') {
          this.world.hero.z += 1;
          this.world.hero.x = this.world.ups[this.world.hero.z][0];
          this.world.hero.y = this.world.ups[this.world.hero.z][1];
          if (this.world.hero.z === 8) {
            const muted = this.game.music.muted;
            this.game.music.pause();
            this.game.music = this.game.bossmusic;
            this.game.music.play();
            this.game.music.muted = muted;
            this.world.log.unshift(
                ' You see a horrible Doubleheaded snake!',
            );
          } else {
            this.world.log.unshift(
                ` You went down to level ${this.world.hero.z}.`,
            );
          }
          this.world.hero.target = null;
          this.world.engine.unlock();
          return;
        }
        if (this.world.hero.medkits > 0 && this.world.hero.health < 10) {
          this.world.hero.medkits -= 1;
          this.world.hero.health = 10;
          this.world.log.unshift(` You used 1+.`);
          this.world.engine.unlock();
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
