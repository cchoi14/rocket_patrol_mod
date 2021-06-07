class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // load audio
    this.load.audio('sfx_select', './assets/blip_select12.wav');
    this.load.audio('sfx_explosion', './assets/explosion38.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
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

    // show menu text
    this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2, 'Use mouse to move, click to fire', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding, 'Click to start', menuConfig).setOrigin(0.5);
  }


  update() {
    mouse = this.input.activePointer;
    if ( mouse.leftButtonDown() ) {
      game.sound.play('sfx_select');
      game.scene.start('playScene');
      game.scene.stop('menuScene');
    }
  }
}