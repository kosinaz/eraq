import Scene from './scene.js';

/**
 * Represents the scene that displays the menu.
 *
 * @export
 * @class MenuScene
 * @extends {Scene}
 */
export default class MenuScene extends Scene {
  /**
   * Opens the menu scene.
   *
   * @memberof MenuScene
   */
  start() {
    super.start(this.game.menuOptions);
    this.game.display.draw(0, 0, 'a');
    this.game.display.draw(0, 1, 'b');
    this.game.display.draw(0, 2, 'c');
    this.game.display.draw(0, 3, 'd');
    this.game.display.draw(0, 4, 'e');
    this.game.display.draw(0, 5, ['f', '➧']);
    this.game.display.draw(0, 6, 'g');
    this.game.display.draw(0, 7, 'h');
    this.game.display.draw(0, 8, 'i');
    this.game.display.draw(1, 0, 'j');
    this.game.display.draw(1, 1, 'k');
    this.game.display.draw(1, 2, 'l');
    this.game.display.draw(1, 3, 'm');
    this.game.display.draw(1, 4, 'n');
    this.game.display.draw(1, 5, 'o');
    this.game.display.draw(1, 6, 'p');
    this.game.display.draw(1, 7, 'q');
    this.game.display.draw(1, 8, this.game.music.muted ? ['r', '♩'] : 'r');
    this.selected = 0;
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof MenuScene
   */
  handleEvent(event) {
    super.handleEvent(event);
    if (event.type === 'keydown') {
      if (event.keyCode === 40 && this.selected < 2) {
        this.game.display.draw(
            0, 5 + this.selected, ['f', 'g', 'h'][this.selected],
        );
        this.selected += 1;
        this.game.display.draw(
            0, 5 + this.selected, [['f', 'g', 'h'][this.selected], '➧'],
        );
      } else if (event.keyCode === 38 && this.selected > 0) {
        this.game.display.draw(
            0, 5 + this.selected, ['f', 'g', 'h'][this.selected],
        );
        this.selected -= 1;
        this.game.display.draw(
            0, 5 + this.selected, [['f', 'g', 'h'][this.selected], '➧'],
        );
      } else if (event.keyCode === 13) {
        if (this.selected === 0) {
          this.switchTo(this.game.worldScene);
        } else if (this.selected === 1) {
          this.switchTo(this.game.helpScene);
        } else if (this.selected === 2) {
          this.switchTo(this.game.creditsScene);
        }
      } else if (event.keyCode === 79) {
        this.switchTo(this.game.winScene);
      }
    } else if (event.type === 'mousedown') {
      if (this.eventX === 0) {
        if (this.eventY === 5) {
          this.switchTo(this.game.worldScene);
        } else if (this.eventY === 6) {
          this.switchTo(this.game.helpScene);
        } else if (this.eventY === 7) {
          this.switchTo(this.game.creditsScene);
        }
      }
      if (this.eventX === 1 && this.eventY === 8) {
        this.game.music.muted = !this.game.music.muted;
        this.update();
      }
    }
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof WorldScene
   */
  update() {
    this.game.display.draw(1, 8, this.game.music.muted ? ['r', '♩'] : 'r');
  }
}
