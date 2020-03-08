import Scene from './scene.js';

/**
 * Represents the scene that displays the credits.
 *
 * @export
 * @class BootScene
 * @extends {Scene}
 */
export default class BootScene extends Scene {
  /**
   * Opens the boot scene.
   *
   * @memberof BootScene
   */
  start() {
    super.start({
      layout: 'rect',
      width: 91,
      height: 30,
      fontSize: 24,
      fontFamily: 'monospace',
      forceSquareRatio: false,
    });
    this.game.display.drawText(30, 12, 'Press any key to start');
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
      this.switchTo(this.game.menuScene);
    } else if (event.type === 'mousedown') {
      this.switchTo(this.game.menuScene);
    }
  }
}
