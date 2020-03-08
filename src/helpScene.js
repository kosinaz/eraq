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
      music: this.game.menumusic,
    });
    this.game.display.drawText(43, 1, 'Help');
    this.game.display.drawText(
        2, 3, ' You are Emmanuel de Rouge, the professor of archeology.' +
        ' Through research you learned about a forgotten Aztec temple' +
        ' that holds the golden feather of divine powers, the Amulet of' +
        ' Quetzalcoatl.',
    );
    this.game.display.drawText(
        2, 7, ' You decided to get it and finally found the island, but your' +
        ' rivals followed you. They will try to get the feather at all costs.',
    );
    this.game.display.drawText(
        2, 12, ' Move with left click on the ground or with arrow or Num or' +
        ' WASD keys',
    );
    this.game.display.drawText(
        2, 14, ' Move upstairs or downstairs with left click on the stairs or' +
        ' with the Enter key',
    );
    this.game.display.drawText(
        2, 16, ' Attack with left click on the enemy or by moving into the ' +
        'position of the enemy',
    );
    this.game.display.drawText(
        2, 18, ' Heal yourself with left click on your character or on the' +
        ' heart or medkit symbols or with the Enter key',
    );
    this.game.display.drawText(
        2, 21, ' Set console or tile-based display with left click on the ' +
        'symbol of your character on the HUD or with the T key',
    );
    this.game.display.drawText(
        2, 24, ' Mute or unmute the music or sound with left click on the' +
        ' music or sound symbol or with the M or N key',
    );
    this.game.display.drawText(2, 28, '➧Back');
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
