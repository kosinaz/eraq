import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Boss
 * @extends {Actor}
 */
export default class Boss extends Actor {
  /**
   * Creates an instance of Boss.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Boss
   */
  constructor(world, position) {
    super(world, position);
    this.char = '𝐒';
    this.name = 'Doubleheaded snake';
    this.health = 10;
    this.damage = 3;
    this.speed = 2;
    this.animal = true;
    this.world.scheduler.add(this, true);
  }

  /**
   * Opens the game over screen.
   *
   * @memberof Actor
   */
  kill() {
    if (this.world.switched < 7) {
      this.health = 10;
      this.x = 26;
      this.y = 16;
      this.world.log[0] += (' The Doubleheaded snake got resurrected!');
    } else {
      super.kill();
      this.world.stats.kills.boss += 1;
      this.world.stats.point += 420;
      this.world.items.set(`26,11,8`, '⤁');
      this.world.log[0] += (' The monster is dead! Grab the feather and run!');
      const muted = this.world.scene.game.music.muted;
      this.world.scene.game.music.pause();
      this.world.scene.game.music = this.world.scene.game.escapemusic;
      this.world.scene.game.music.play();
      this.world.scene.game.music.muted = muted;
    }
  }
}
