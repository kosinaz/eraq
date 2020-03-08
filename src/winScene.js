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
   * Opens the win scene.
   *
   * @memberof WinScene
   */
  start() {
    super.start(this.game.winOptions);
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
