class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // load audio
    this.load.audio('sfx_select', './assets/blip_select12.wav');
    this.load.audio('sfx_explosion', './assets/explosion38.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    // load image
    this.load.image('spaceship', './assets/spaceship.png');
  }

  create() {
    //menu text config
    let menuConfig = {
      fontFamily: 'Eight Bit Dragon',
      fontSize: '30px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }

    // add key R
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // bind mouse to pointer
    mouse = this.input.activePointer;

    // show menu text
    this.add.text(game.config.width / 2, borderUISize + borderPadding * 2, 'ROCKET', menuConfig).setOrigin(0.5);
    this.menuShipTop = new Spaceship(this, game.config.width, borderUISize * 3, 'spaceship', 0, 30).setOrigin(0, 0);
    this.menuShipMid = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
    this.menuShipBot = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
    this.add.text(game.config.width / 2, borderUISize * 6 + borderPadding * 8, 'PATROL', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 5, 'Use mouse to move, click to fire', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 6 + borderPadding, 'Press R to start', menuConfig).setOrigin(0.5);
  }

  update() {
    //  go to next scene
    if (Phaser.Input.Keyboard.JustDown(keyR)) {
      this.sound.play('sfx_select');
      this.scene.start('playScene');    
    }

    this.menuShipTop.update();
    this.menuShipMid.update();
    this.menuShipBot.update();
  }
}