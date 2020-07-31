
// const testModules = require('./test-module');
require('../css/app.css');
require('../scss/style.scss');

/********** Paste your code here! ************/

import { init, Sprite, SpriteSheet, GameLoop } from 'kontra';

let { canvas } = init();

let block = Sprite({
  x: canvas.width,        // starting x,y position of the me
  y: canvas.height - 50,
  color: '#ff0',  // fill color of the me rectangle
  width: 30,     // width and height of the me rectangle
  height: 20,
  dx: -2,
  anchor: {x: 1, y: 1}
});

let ground = Sprite({
  x: 0,
  y: canvas.height - 50,
  color: '#a0a0a0',
  width: canvas.width,
  height: 50,
});

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
        frames: "0..9",  // frames 0 through 9
        frameRate: 30
      }
    }
  });

  let sprite = Sprite({
    x: canvas.width / 2,
    y: 305,
    anchor: {x: 0.5, y: 0.5},

    // use the sprite sheet animations for the sprite
    animations: spriteSheet.animations
  });

  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state
      sprite.update();
      block.update();

      if(block.x < 0) {
        block.x = canvas.width;
      }
    },
    render: function() { // render the game state
      sprite.render();
      ground.render();
      block.render();
    }
  });

  loop.start();    // start the game
};
