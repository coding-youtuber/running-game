
// const testModules = require('./test-module');
require('../css/app.css');
require('../scss/style.scss');

/********** Paste your code here! ************/

import { init, Sprite, SpriteSheet, GameLoop } from 'kontra';

let { canvas } = init();

// let me = Sprite({
//   x: canvas.width / 2 - 20,        // starting x,y position of the me
//   y: canvas.height - 200,
//   color: 'red',  // fill color of the me rectangle
//   width: 20,     // width and height of the me rectangle
//   height: 100
// });

// let ground = Sprite({
//   x: 0,
//   y: canvas.height - 100,
//   color: '#ccc',
//   width: canvas.width,
//   height: 100,
//   dx: 0

let image = new Image();
// image.src = 'images/Platformer_SpriteSheet.png';
image.src = 'images/character_walk_sheet.png';

image.onload = function() {
  
  let spriteSheet = SpriteSheet({
    image: image,
    frameWidth: 72,
    frameHeight: 97,
    animations: {
      // create a named animation: walk
      walk: {
        frames: '0..9',  // frames 0 through 9
        frameRate: 30
      }
    }
  });

  let sprite = Sprite({
    x: 0,
    y: 0,

    // use the sprite sheet animations for the sprite
    animations: spriteSheet.animations
  });

  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state
      sprite.update();
    },
    render: function() { // render the game state
      sprite.render();
    }
  });

  loop.start();    // start the game
};
