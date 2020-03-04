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
    super.start({
      width: 91,
      height: 30,
      fontSize: 24,
      fontFamily: 'monospace',
    });
    this.game.display.drawText(21, 1, 'GAME OVER!');
    this.game.display.drawText(1, 28, '➧Back to main menu');
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
      if (this.eventX > 1 && this.eventX < 19 && this.eventY === 28) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
