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
    super.start();
    this.game.display.drawText(36, 1, 'Credits');
    this.game.display.drawText(
        2, 4, 'Code: by Zoltan Kosina Licensed under the Unlicense',
    );
    this.game.display.drawText(
        2,
        6,
        'Tool: rotjs by Ondrej Zara Licensed under BSD 3 Clause New or Revised',
    );
    this.game.display.drawText(
        2, 8, 'Art: 1 Bit Pack by Kenney Licensed under Creative Commons Zero',
    );
    this.game.display.drawText(1, 23, '➧Back');
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
      if (this.eventX > 1 && this.eventX < 6 && this.eventY === 23) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
