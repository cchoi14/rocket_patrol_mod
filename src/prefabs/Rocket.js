// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);       //add to existing, displayList, updateList
        this.isFiring = false;          //track rocket's firing status

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        // follow mouse x position
        this.x = mouse.x;

        // fire
        if(mouse.leftButtonDown() && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }

        // if fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= 3;
        }

        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // reset rocket firing state
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}