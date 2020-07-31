
// const testModules = require('./test-module');
require('../css/app.css');
require('../scss/style.scss');

/********** Paste your code here! ************/

import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed } from 'kontra';

let { canvas } = init();
initKeys();

const maxUp = 25;
const gravityY = 1;
const jumpPower = 3;

let upScore = 0;

function jump(sprite) {
  upScore++;
  if(upScore < maxUp) {
    sprite.playAnimation("jump");
    sprite.y -= jumpPower;
  }
}

function stopJump(sprite) {
  upScore = maxUp;
}

function jumpCoolOff(sprite) {
  sprite.playAnimation("walk");
  upScore = 0;
}

function gravity(sprite) {
  sprite.y += gravityY;
}

let block = Sprite({
  x: canvas.width,        // starting x,y position of the me
  y: canvas.height - 50,
  color: '#ff0',  // fill color of the me rectangle
  width: 10,     // width and height of the me rectangle
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
      },
      jump: {
        frames: 1,
        frameRate: 1,
      }
    }
  });

  let player = Sprite({
    x: canvas.width / 2,
    y: 305,
    anchor: {x: 0.5, y: 0.5},

    // use the sprite sheet animations for the sprite
    animations: spriteSheet.animations,
  });

  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state
      if(keyPressed("up")) {
        console.log("up");

        jump(player);
      } else {
        // console.log("unpressed");

        stopJump(player);
      }

      if(player.y < 305) {
        gravity(player);
      } else {
        jumpCoolOff(player);
      }

      player.update();
      block.update();

      if(block.x < 0) {
        block.x = canvas.width;
      }

      if(player.collidesWith(block)) {
        console.log("collide");
        
      }
    },
    render: function() { // render the game state
      player.render();
      ground.render();
      block.render();
    }
  });

  loop.start();    // start the game
};
