import Scene from './scene.js';

/**
 * Represents the scene that displays the help.
 *
 * @export
 * @class HelpScene
 * @extends {Scene}
 */
export default class HelpScene extends Scene {
  /**
   * Opens the help scene.
   *
   * @memberof HelpScene
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
    this.game.display.drawText(43, 1, 'Help');
    this.game.display.drawText(
        2, 4, 'Move or attack with mouse or arrow or num or wasd keys',
    );
    this.game.display.drawText(
        2, 6, 'Move upstairs or downstairs with mouse or enter key',
    );
    this.game.display.drawText(
        2, 8, 'Set console or tile-based display with mouse or t key',
    );
    this.game.display.drawText(
        2, 10, 'Mute or unmute the music with mouse or m key',
    );
    this.game.display.drawText(1, 28, '➧Back');
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
      if (this.eventX > 1 && this.eventX < 6 && this.eventY === 28) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
