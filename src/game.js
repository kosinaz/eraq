import {Display} from '../lib/rot/index.js';
import MenuScene from './menuScene.js';
import WorldScene from './worldScene.js';
import HelpScene from './helpScene.js';
import CreditsScene from './creditsScene.js';
import WinScene from './winScene.js';
import FailScene from './failScene.js';

/**
 * Represent the game core object.
 *
 * @class Game
 */
export default class Game {

}
Game.tiled = false;
const tileset = document.createElement('img');
tileset.src = './images/tiles.png';
Game.rectOptions = {
  layout: 'rect',
  width: 52,
  height: 30,
  fontSize: 24,
  fontFamily: 'monospace',
  forceSquareRatio: true,
};
Game.tileOptions = {
  layout: 'tile-gl',
  tileWidth: 24,
  tileHeight: 24,
  tileSet: tileset,
  tileMap: {
    ' ': [216, 216],
    'Ⓟ': [0, 0],
    'Ⓨ': [24, 0],
    'Ⓑ': [48, 0],
    'Ⓡ': [72, 0],
    'Ⓖ': [96, 0],
    'Ⓥ': [120, 0],
    'Ⓦ': [144, 0],
    'Ⓞ': [168, 0],
    '~': [0, 24],
    '≈': [24, 24],
    '≋': [48, 24],
    '♣': [72, 24],
    '♠': [96, 24],
    '̬ ': [120, 24],
    'ˬ': [168, 24],
    '˯': [192, 24],
    '#': [0, 48],
    '‧': [48, 48],
    '⋅': [72, 48],
    '∙': [144, 48],
    '•': [216, 48],
    '𝐬': [0, 72],
    '+': [24, 72],
    '<': [48, 72],
    '>': [72, 72],
    '𝐭': [96, 72],
    '𝐦': [120, 72],
    '𝐛': [144, 72],
    '𝐣': [168, 72],
    '𝐝': [192, 72],
    '𝐥': [216, 72],
    '𝐒': [0, 96],
    '⤁': [24, 96],
    '♥': [48, 96],
    '♡': [96, 96],
    '➧': [144, 96],
    '🕪': [168, 96],
    '🕨': [192, 96],
    '𝐜': [216, 96],
    '𝐞': [0, 120],
    '⌐': [24, 120],
    '␦': [48, 120],
    '⊠': [72, 120],
    '⁍': [96, 120],
    ':': [216, 216],
    '.': [96, 264],
    '!': [24, 240],
    '0': [144, 264],
    '1': [168, 264],
    '2': [192, 264],
    '3': [216, 264],
    '4': [0, 288],
    '5': [24, 288],
    '6': [48, 288],
    '7': [72, 288],
    '8': [96, 288],
    '9': [120, 288],
    'a': [120, 384],
    'b': [144, 384],
    'c': [168, 384],
    'd': [192, 384],
    'e': [216, 384],
    'f': [0, 408],
    'g': [24, 408],
    'h': [48, 408],
    'i': [72, 408],
    'j': [96, 408],
    'k': [120, 408],
    'l': [144, 408],
    'm': [168, 408],
    'n': [192, 408],
    'o': [216, 408],
    'p': [0, 432],
    'q': [24, 432],
    'r': [48, 432],
    's': [72, 432],
    't': [96, 432],
    'u': [120, 432],
    'v': [144, 432],
    'w': [168, 432],
    'x': [192, 432],
    'y': [216, 432],
    'z': [0, 456],
    'A': [72, 312],
    'B': [96, 312],
    'C': [120, 312],
    'D': [144, 312],
    'E': [168, 312],
    'F': [192, 312],
    'G': [216, 312],
    'H': [0, 336],
    'I': [24, 336],
    'J': [48, 336],
    'K': [72, 336],
    'L': [96, 336],
    'M': [120, 336],
    'N': [144, 336],
    'O': [168, 336],
    'P': [192, 336],
    'Q': [216, 336],
    'R': [0, 360],
    'S': [24, 360],
    'T': [48, 360],
    'U': [72, 360],
    'V': [96, 360],
    'W': [120, 360],
    'X': [144, 360],
    'Y': [168, 360],
    'Z': [192, 360],
  },
  tileColorize: true,
  width: 52,
  height: 30,
};
Game.display = new Display(Game.menuOptions);
Game.display.drawText = function(x, y, text, color, width) {
  width = width || 85;
  const words = text.split(' ');
  const rows = [''];
  let j = 0;
  for (let i = 0; i < words.length; i += 1) {
    if (rows[j].length + words[i].length + 1 > width) {
      j += 1;
      rows[j] = ' ';
    }
    rows[j] += `${words[i]} `;
  }
  if (rows.length > 2) {
    const row = rows.pop();
    for (let i = 0; i < row.length; i += 1) {
      this.draw(
          x + i, y + 2, row[i], Game.tiled ? color || 'transparent' : null,
      );
    };
  }
  if (rows.length > 1) {
    const row = rows.pop();
    for (let i = 0; i < row.length; i += 1) {
      this.draw(
          x + i, y + 1, row[i], Game.tiled ? color || 'transparent' : null,
      );
    };
  }
  if (rows.length > 0) {
    const row = rows.pop();
    for (let i = 0; i < row.length; i += 1) {
      this.draw(
          x + i, y, row[i], Game.tiled ? color || 'transparent' : null,
      );
    };
  }
};
Game.canvas = Game.display.getContainer();
document.body.appendChild(Game.canvas);
Game.worldScene = new WorldScene(Game);
Game.helpScene = new HelpScene(Game);
Game.creditsScene = new CreditsScene(Game);
Game.winScene = new WinScene(Game);
Game.failScene = new FailScene(Game);
Game.menuScene = new MenuScene(Game);
tileset.onload = function() {
  Game.menuScene.start();
};
