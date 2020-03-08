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
    super.start(this.game.failOptions);
    this.game.display.draw(0, 0, 'a');
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
        this.switchTo(this.game.mortemScene);
      }
    } else if (event.type === 'mousedown') {
      this.switchTo(this.game.mortemScene);
    }
  }
}
