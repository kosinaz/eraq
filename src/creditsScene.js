import Scene from './scene.js';

/**
 * Represents the scene that displays the credits.
 *
 * @export
 * @class CreditsScene
 * @extends {Scene}
 */
export default class CreditsScene extends Scene {
  /**
   * Opens the credits scene.
   *
   * @memberof CreditsScene
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
    this.game.display.drawText(41, 1, 'Credits');
    // eslint-disable-next-line max-len
    this.game.display.drawText(2, 4, 'Code: by Zoltan Kosina (github.com/kosinaz) Licensed under the Unlicense');
    // eslint-disable-next-line max-len
    this.game.display.drawText(2, 6, 'Tool: rot.js by Ondrej Zara (ondras.zarovi.cz) Licensed under BSD3 Clause New or Revised');
    // eslint-disable-next-line max-len
    this.game.display.drawText(2, 8, 'Art: by ComboSmooth (combosmooth.itch.io) Licensed under the Unlicense');
    // eslint-disable-next-line max-len
    this.game.display.drawText(2, 10, 'Music: by Elijah Fisch (www.elijahfisch.com) Licensed under the Unlicense');
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
