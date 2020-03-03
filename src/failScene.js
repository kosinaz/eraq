import Scene from './scene.js';

/**
 * Represents the scene that displays the help.
 *
 * @export
 * @class FailScene
 * @extends {Scene}
 */
export default class FailScene extends Scene {
  /**
   * Opens the help scene.
   *
   * @memberof FailScene
   */
  start() {
    super.start();
    this.game.display.drawText(35, 1, 'GAME OVER');
    this.game.display.drawText(1, 23, '➧Back to main');
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    super.handleEvent(event);
    if (event.type === 'keydown') {
      if (event.keyCode === 13) {
        this.switchTo(this.game.menuScene);
      }
    } else if (event.type === 'mousedown') {
      if (this.eventX > 1 && this.eventX < 14 && this.eventY === 23) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
