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
    this.game.display.drawText(33, 1, 'Post mortem');
    this.game.display.drawText(0, 3, this.game.mortem[0]);
    this.game.display.drawText(
        1, 7, `You survived ${this.game.stats.turn} turns.`,
    );
    this.game.display.drawText(
        1, 8, `You reached level ${this.game.stats.level}.`,
    );
    if (this.game.stats.escape) {
      this.game.display.drawText(
          1, 9, `You successfully escaped with the Amulet of Quetzalcoatl!`,
      );
    }
    this.game.display.drawText(1, 11, 'Kills:');
    this.game.display.drawText(2, 12, `Rival: ${this.game.stats.kills.rival}`);
    this.game.display.drawText(
        2, 13, `Tarantula: ${this.game.stats.kills.tarantula}`,
    );
    this.game.display.drawText(2, 14, `Bat: ${this.game.stats.kills.bat}`);
    this.game.display.drawText(2, 15, `Snake: ${this.game.stats.kills.snake}`);
    this.game.display.drawText(
        2, 16, `Crocodile: ${this.game.stats.kills.crocodile}`,
    );
    this.game.display.drawText(2, 17, `Dog: ${this.game.stats.kills.dog}`);
    this.game.display.drawText(
        2, 18, `Jaguar: ${this.game.stats.kills.jaguar}`,
    );
    this.game.display.drawText(
        2, 19, `Monkey: ${this.game.stats.kills.monkey}`,
    );
    this.game.display.drawText(
        2, 20, `Lizard: ${this.game.stats.kills.lizard}`,
    );
    this.game.display.drawText(
        2, 21, `Eagle: ${this.game.stats.kills.eagle}`,
    );
    this.game.display.drawText(
        2, 22, `Doubleheaded snake: ${this.game.stats.kills.boss}`,
    );
    this.game.display.drawText(40, 11, 'Items:');
    this.game.display.drawText(41, 12, `Whip: ${this.game.stats.items.whip}`);
    this.game.display.drawText(
        41, 13, `Pistol: ${this.game.stats.items.pistol}`,
    );
    this.game.display.drawText(
        41, 14, `Bullet: ${this.game.stats.items.bullet}`,
    );
    this.game.display.drawText(
        41, 15, `Medkit: ${this.game.stats.items.medkit}`,
    );
    this.game.display.drawText(
        41, 16, `Amulet of Quetzalcoatl: ${this.game.stats.items.amulet}`,
    );
    this.game.display.drawText(
        41, 24, `Final score: ${this.game.stats.point}`,
    );
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
