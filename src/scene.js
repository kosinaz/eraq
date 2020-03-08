/**
 * Represents the scene that displays the content of the game.
 *
 * @export
 * @class Scene
 */
export default class Scene {
  /**
   * Creates an instance of Scene.
   *
   * @param {Game} game
   * @memberof Scene
   */
  constructor(game) {
    this.game = game;
  }

  /**
   * Opens the scene and starts listening to the events over it.
   *
   * @param {*} style
   * @memberof Scene
   */
  start(style) {
    this.game.display.clear();
    this.game.tiled = style.layout === 'tile-gl';
    this.game.display.setOptions(style);
    document.body.removeChild(this.game.canvas);
    this.game.canvas = this.game.display.getContainer();
    document.body.appendChild(this.game.canvas);
    const muted = this.game.music.muted;
    this.game.music.pause();
    this.game.music = style.music;
    this.game.music.play();
    this.game.music.muted = muted;
    window.addEventListener('keydown', this);
    window.addEventListener('mousedown', this);
    window.addEventListener('mouseup', this);
    window.addEventListener('mousemove', this);
  }

  /**
   * Handles the events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    if (event.type === 'mousedown' ||
        event.type === 'mouseup' ||
        event.type === 'mousemove') {
      this.eventX = this.game.display.eventToPosition(event)[0];
      this.eventY = this.game.display.eventToPosition(event)[1];
    } else if (event.type === 'keydown') {
      if (event.keyCode > 36 && event.keyCode < 41) {
        event.preventDefault();
      } else if (event.keyCode === 77) {
        this.game.music.muted = !this.game.music.muted;
        this.update();
        return;
      }
    }
  }

  /**
   * Start the specified scene and stops the current one.
   *
   * @param {Scene} scene
   * @memberof MenuScene
   */
  switchTo(scene) {
    window.removeEventListener('keydown', this);
    window.removeEventListener('mousedown', this);
    window.removeEventListener('mouseup', this);
    window.removeEventListener('mousemove', this);
    scene.start();
  }
  /**
   * Redraw the world around the hero.
   *
   * @memberof WorldScene
   */
  update() {
  }
}
