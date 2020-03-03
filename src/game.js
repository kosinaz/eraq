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
Game.menuOptions = {
  width: 32,
  height: 18,
  fontSize: 40,
  fontFamily: 'title',
};
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
    ' ': [144, 144],
    '@': [72, 0],
    '§': [0, 72],
    'ᨓ': [144, 72],
    '#': [0, 48],
    '~': [0, 24],
    '♣': [96, 24],
    '̬ ': [120, 24],
    'ˬ': [168, 24],
    '˯': [192, 24],
    '‧': [120, 48],
    '+': [24, 72],
    '⌐': [85, 527],
    '⊠': [144, 144],
    '⁍': [144, 144],
    '>': [72, 72],
    '<': [48, 72],
    '♥': [144, 144],
    '♡': [144, 144],
    '🕨': [144, 144],
    '🕪': [144, 144],
    '➧': [144, 144],
    ':': [144, 144],
    '.': [144, 144],
    '!': [144, 144],
    '0': [144, 144],
    '1': [144, 144],
    '2': [144, 144],
    '3': [144, 144],
    '4': [144, 144],
    '5': [144, 144],
    '6': [144, 144],
    '7': [144, 144],
    '8': [144, 144],
    '9': [144, 144],
    'a': [144, 144],
    'b': [144, 144],
    'c': [144, 144],
    'd': [144, 144],
    'e': [144, 144],
    'f': [144, 144],
    'g': [144, 144],
    'h': [144, 144],
    'i': [144, 144],
    'j': [144, 144],
    'k': [144, 144],
    'l': [144, 144],
    'm': [144, 144],
    'n': [144, 144],
    'o': [144, 144],
    'p': [144, 144],
    'q': [144, 144],
    'r': [144, 144],
    's': [144, 144],
    't': [144, 144],
    'u': [144, 144],
    'v': [144, 144],
    'w': [144, 144],
    'x': [144, 144],
    'y': [144, 144],
    'z': [144, 144],
    'A': [144, 144],
    'B': [144, 144],
    'C': [144, 144],
    'D': [144, 144],
    'E': [144, 144],
    'F': [144, 144],
    'G': [144, 144],
    'H': [144, 144],
    'I': [144, 144],
    'J': [144, 144],
    'K': [144, 144],
    'L': [144, 144],
    'M': [144, 144],
    'N': [144, 144],
    'O': [144, 144],
    'P': [144, 144],
    'Q': [144, 144],
    'R': [144, 144],
    'S': [144, 144],
    'T': [144, 144],
    'U': [144, 144],
    'V': [144, 144],
    'W': [144, 144],
    'X': [144, 144],
    'Y': [144, 144],
    'Z': [144, 144],
  },
  tileColorize: true,
  width: 52,
  height: 30,
};
Game.display = new Display(Game.menuOptions);
Game.display.drawText = function(x, y, text) {
  for (let i = 0; i < text.length; i += 1) {
    this.draw(x + i, y, text[i], Game.tiled ? 'transparent' : null);
  };
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
