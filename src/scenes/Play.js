class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('red_dot', './assets/red_dot.png');
        this.load.audio('pogs', './assets/komiku_battleOfPogs.mp3');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
        this.load.spritesheet('laser_sprite', './assets/laser.png', {
            frameWidth: 50,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 19
        });
    }

    create() {
        if (this.bgm == undefined) //prevent duplication
        {
            this.bgm = this.sound.add('pogs');
        }

        // bind mouse to pointer
        mouse = this.input.activePointer;

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, mouse.x, game.config.height - borderUISize - borderPadding, 'rocket');
        // update rocket sprite

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship01.setSpeed(4);
        this.ship02.setSpeed(4);
        this.ship03.setSpeed(4);

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });
        this.anims.create({
            key: 'laser',
            frames: this.anims.generateFrameNumbers('laser_sprite', { start: 0, end: 19, first: 0 }),
            frameRate: 10
        });

        // initialize score and time
        this.p1Score = 0;
        this.p1Time = 60;

        // GAME OVER flag
        this.gameOver = false;


        let textConfig = {
            fontFamily: 'Eight Bit Dragon',
            fontSize: '30px',
            backgroundColor: '#F3B141',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 200
        }
        // display score,  highscore, time
        this.scoreDisplay = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, 'Score: ' + this.p1Score, textConfig);
        this.highscoreDisplay = this.add.text(borderUISize + borderPadding + 210, borderUISize + borderPadding * 2, 'Hiscore: ' + highscore, textConfig);
        this.timeDisplay = this.add.text(borderUISize + borderPadding + 420, borderUISize + borderPadding * 2, 'Time: ' + this.p1Time, textConfig);

        // 60-second play clock
        countdown = this.time.addEvent({
            delay: 1000,
            callback: this.countdownTick,
            callbackScope: this,
            loop: true
        });

        // speed ships up after every 30 seconds
        clock = this.time.addEvent({
            delay: 30000,
            callback: this.speedUp,
            callbackScope: this,
            loop: true
        });

        // create particle emitter
        particles = this.add.particles('red_dot');
        emitter = particles.createEmitter({
            speed: { min: 5, max: 50 },
            quantity: { min: 60, max: 100 },
            lifespan: 1000,
            on: false
        });
    }

    update() {
        if (!this.bgm.isPlaying) {
            this.bgm.play();
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            this.checkHighscore(this.p1Score);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyT)) {
            this.scene.start("menuScene");
            this.checkHighscore(this.p1Score);
            this.bgm.stop;
        }

        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.p1Rocket.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        particles.emitParticleAt(ship.x, ship.y);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
            // score add and repaint
            this.p1Score += ship.points;
            this.p1Time += ship.points / 10;
            this.scoreDisplay.text = 'Score: ' + this.p1Score;
            this.timeDisplay.text = 'Time: ' + this.p1Time;
            this.sound.play('sfx_explosion');
        });
    }

    checkHighscore(score) {
        if (score > highscore) {
            highscore = score;
        }
    }

    countdownTick() {
        this.p1Time -= 1;
        this.timeDisplay.text = 'Time: ' + this.p1Time;
        if (this.p1Time <= 0) {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', textConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart\nor (T) to exit to title', textConfig).setOrigin(0.5);
            this.gameOver = true;
            countdown.paused = true;
            clock.paused = true;
        }
    }

    speedUp() {
        this.ship01.addSpeed(2);
        this.ship02.addSpeed(2);
        this.ship03.addSpeed(2);
    }
}