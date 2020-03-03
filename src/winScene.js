import Scene from './scene.js';

/**
 * Represents the scene that displays the help.
 *
 * @export
 * @class WinScene
 * @extends {Scene}
 */
export default class WinScene extends Scene {
  /**
   * Opens the help scene.
   *
   * @memberof WinScene
   */
  start() {
    super.start();
    this.game.display.drawText(30, 1, 'CONGRATULATIONS! YOU WON!');
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
