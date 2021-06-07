/*  
    Creator: Johnny Choi
    Title: Rocket Patrol
    Date: 

    Mods attempted:
    - Track a high score that persists across scenes and display it in the UI (5)
    - Allow the player to control the Rocket after it's fired (5)
    - Create a new title screen (e.g. new artwork, typography, layout) (10)
    - Display the time remaining (in seconds) on the screen (10)
    - Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
    - Implement mouse control for player movement and mouse click to fire (20)
    - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)
 */
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyR, keyT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// create pointer
let mouse;

// track highscore and time
let highscore = 0;
let countdown;
let particles, emitter;