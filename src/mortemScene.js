import Scene from './scene.js';

/**
 * Represents the scene that displays the help.
 *
 * @export
 * @class MortemScene
 * @extends {Scene}
 */
export default class MortemScene extends Scene {
  /**
   * Opens the post mortem scene.
   *
   * @memberof MortemScene
   */
  start() {
    super.start({
      layout: 'rect',
      width: 91,
      height: 30,
      fontSize: 24,
      fontFamily: 'monospace',
      forceSquareRatio: false,
      music: this.game.winmusic,
    });
    this.game.display.drawText(33, 1, 'CONGRATULATIONS! YOU WON!');
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
