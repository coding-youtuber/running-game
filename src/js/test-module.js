// used in game.js
var loop;
var isOver = false;
var isRunning = false;
var isLoaded = false;
var collects = [];
var obstacles = [];
var canvas = document.getElementById("screen");
var score_html = document.getElementById("score");
var text_box = document.getElementById("text-box");
var width= canvas.width;
var height= canvas.height;
var score = 0;
var time = 0;
var talk_period = 250;
var coin_period = 1500;
var spawn_period = 300;

var context = canvas.getContext("2d");
context.font = "20px Arial";
context.fillStyle = "#ffffff";

var isScoreChecked = false;
var difficulty_level = 1;
var scoreCheck = 10;
var max_speed = 10;
var min_period = 120;

// used in mechanic.js
var y_origin;

var gravity_power = 1;
var jump_power = 3;

var up_score = 0;
var down_score = 0;

var max_up = 23;
var max_down = 20;

var spawner_ground;
//var spawner_min;
//var spawner_med;
var spawner_max;

var game_speed = 1;



function jump(sprite)
{
    console.log(up_score);
    up_score++;

    if(up_score < max_up)
    {
        sprite.playAnimation('jump');
        sprite.y -= jump_power;
    }
};

function stop_jump()
{
    up_score = max_up;
};

function jump_cooloff(sprite)
{
   sprite.playAnimation('walk');
   up_score = 0;
};

//NEED TO FIX
function slide()
{
    console.log(down_score);
    down_score++;

    if(down_score < max_down)
    {
        runner_sprite.y = y_origin + 5;
    }
    else
    {
        runner_sprite.y = y_origin;
    }
};

function spawn_obstacle(num)
{
    var choice = getRandomInt(1,3);
    console.log(choice);
    var image;
    var spawn = spawner_ground;
    var offset = 0;

    if(num==0)
    {
        switch (choice) 
        {
            case 1:
                image = kontra.imageAssets.rock;
                offset = 8;
                break;
            case 2:
                image = kontra.imageAssets.cactus;
                offset = 0;
                break;
            case 3:
                image = kontra.imageAssets.totem;
                offset = -8;
                break;   
            default:
                break;
        }
    }
    else if(num==1)
    {
        spawn = spawner_max;
        image = kontra.imageAssets.coin;
    }

    var sprite = kontra.Sprite(
        {
            x: -16,
            y: spawn+offset,
            dx: game_speed,
            image: image
        });

    return sprite;
}

function count_score(item)
{
    var image = item.image;
    isScoreChecked = false;

    switch(image)
    {
        case kontra.imageAssets.rock:
            score+=1;
            break;
        case kontra.imageAssets.cactus:
            score+=3;
            break;
        case kontra.imageAssets.totem:
            score+=5;
            break;
        case kontra.imageAssets.coin:
            score+=10;
            break;
    }
};

function check_score()
{
    if(!isScoreChecked)
    {
        isScoreChecked = true;
        if(score > 10*difficulty_level)
        {
            level_up();
        }
    }
};

function level_up()
{
    difficulty_level++;

    if(spawn_period > min_period)
    {
        spawn_period-=5;
    }

    if(game_speed<max_speed && difficulty_level%3 == 0)
    {
        game_speed+= 0.5;
    }
};

function gravity(sprite)
{
    sprite.y += gravity_power;
};

function screen_write(num)
{
    switch(num)
    {
        case 0: // CLEAR SCREEN
            text_box.innerHTML = "";
            context.clearRect(0, 0, width, height);
            break;
        case 1: // TITLE SCREEN
            text_box.innerHTML = intro_text;
            context.fillText("WE MUST ", 20, 50);
            context.fillText("GO BACK" , 20, 70);
            break;
        case 2: // GAME OVER
            loop.stop();
            text_box.innerHTML = over_text1+score+over_text2;
            /*
            context.clearRect(0, 0, width, height);
            context.fillText("GAME ", 33, 50);
            context.fillText("OVER" , 35, 70);
            */
            isOver = true;
            break;
    }
};

function reset()
{
    time = 0;
    score = 0;
    difficulty_level =1;
    spawn_period = 300;
    game_speed = 1;

    collects = [];
    obstacles = [];
    loop.start();
};

async function talk(text)
{
    var display= "";

    for(var i=0; i<text.length; i++)
    {
        display += text.charAt(i);
        text_box.innerHTML = display;
    }
    
};

function talk_decision()
{
    var old_text = text_box.innerHTML;

    if(old_text == dialogue_intro1)
    {
        talk(dialogue_intro2);
    }
    else if(old_text == dialogue_intro2)
    {
        talk(dialogue_intro3);
    }
    else
    {
        var random = getRandomInt(1,4);

        switch(random)
        {
            case 1:
                talk(dialogue1);
                break;
            case 2:
                talk(dialogue2);
                break;
            case 3:
                talk(dialogue3);
                break;
            case 4:
                talk(dialogue4);
                break;
        }
    }
                        
};

function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
var intro_text = 
"Press 'up' arrow to JUMP <br> Press 'ENTER' to Start the Game";

var over_text1 =
"You did ";

var over_text2 =
" points! <br> Press 'ENTER' to Play Again!";

var dialogue_intro1 =
"Oh Boy! Did I turn off my stove?";

var dialogue_intro2 =
"MARBLES! I think not...";

var dialogue_intro3 =
"If I run backwards I can get there faster! Trust me";

var dialogue1 =
"What a beatiful day!";

var dialogue2 =
"Are we there yet?";

var dialogue3 =
"Sometimes I can't feel my legs";

var dialogue4 =
"I can't see where I'm going.";

kontra.init();
kontra.initKeys();

kontra.setImagePath('assets/images');
kontra.setAudioPath('assets/sounds')

kontra.load('run.png','cactus.png','totem.png','rock.png', 'coin.png').then(function()
{
    screen_write(1);

    var spriteSheet = kontra.SpriteSheet({
        image: kontra.imageAssets.run,
        frameWidth: 16,
        frameHeight: 15,
        animations: 
        {
            walk: 
            {
              frames: '0..1',  
              frameRate: 10
            },

            jump:
            {
              frames: 0,  
              frameRate: 30
            }
        }
    });

    /*
    var runner_sprite = kontra.Sprite(
        {
            x: (width/2)-8,
            y: height-50,
            image: kontra.imageAssets.a
        });
    */

   var runner_sprite = kontra.Sprite(
    {
        x: (width/2)-8,
        y: height-50,
        animations: spriteSheet.animations
    });

    var ground = kontra.Sprite(
        {
            x: 0,
            y: height-35,
            color: 'green',
            height: 50,
            width: width
        });
        
    // global mechanic variables
    y_origin = runner_sprite.y;
    spawner_ground = y_origin;
    //spawner_min = y_origin-8;
    //spawner_med = y_origin-16;
    spawner_max = y_origin-24;
        
        loop = kontra.GameLoop(
        {
            update: function()
            {
                if(!isRunning)
                {
                    isRunning = true;
                    //intro dialogue here!!!!
                    talk(dialogue_intro1);
                }
                else if(isOver)
                {
                    runner_sprite.y = y_origin; //reset runner position
                    isOver = false;
                }

                time++;

                if(kontra.keyPressed('up')) // JUMP
                {
                    jump(runner_sprite);                   
                }
                else
                {
                    stop_jump();
                }


                /*
                //TODO:FIXME DEPRECATED
                if(kontra.keyPressed('down')) // SLIDE
                {
                    
                   slide(runner_sprite);
                }
                else
                {
                    //runner_sprite.y = y_origin;
                    down_score = 0;
                }
                */

                

                if(runner_sprite.y < y_origin) //GRAVITY
                {
                    gravity(runner_sprite);
                }
                else if(runner_sprite.y == y_origin) //TOUCHED GROUND
                {
                    jump_cooloff(runner_sprite);
                }

                if(time%coin_period == 0)
                {
                    var collect = spawn_obstacle(1);
                    collects.push(collect);
                }
                if(time%spawn_period == 0)
                {
                    score++;
                    var obstacle = spawn_obstacle(0);
                    obstacles.push(obstacle);
                }
                else if(time%talk_period == 0)
                {
                    talk_decision();
                }
                
                runner_sprite.update();
                ground.update();

                obstacles.forEach(function(obstacle, index) 
                {
                    obstacle.update();

                    if(obstacle.collidesWith(runner_sprite))
                    {
                        screen_write(2);
                    }
                    else if(obstacle.x >= width+obstacle.width)
                    {
                        count_score(obstacle);
                        obstacles.splice(index,1);
                    }
                });

                collects.forEach(function(collect, index) 
                {
                    collect.update();

                    if(collect.collidesWith(runner_sprite))
                    {
                        count_score(collect);
                        collects.splice(index,1);
                    }
                    else if(collect.x >= width+collect.width)
                    {
                        collects.splice(index,1);
                    }
                });

                score_html.innerHTML = score;
                check_score();
            },
        
            render: function()
            {  
                ground.render();
                runner_sprite.render();

                if(obstacles.length > 0)
                {
                    for(i=0;i<obstacles.length;i++)
                    obstacles[i].render();
                }

                if(collects.length > 0)
                {
                    for(i=0;i<collects.length;i++)
                    collects[i].render();
                }
            }
        });
        
        
        
        
        //}
        isLoaded = true;
});


// Start Screen

document.addEventListener('keyup',function(k){start_game(k);});

function start_game(k)
{
    //console.log(k.code);
    if(isLoaded && !isRunning && k.code =="Enter")
    {
        canvas.style.backgroundColor = "lightblue";
        text_box.innerHTML = "";
        loop.start();
    }
    else if(isLoaded && isOver && k.code =="Enter")
    {
        canvas.style.backgroundColor = "lightblue";
        text_box.innerHTML = "";
        isRunning = false; //just to reset inner text
        reset();
    }
}


