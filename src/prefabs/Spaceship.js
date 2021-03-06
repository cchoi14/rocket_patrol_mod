  //Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //add to existing scene
        this.points = pointValue;   //store pointValue
        this.moveSpeed = 4;         //pixels per frame
    }

    update() {
        //move spaceship left
        this.x -= this.moveSpeed;

        //wrap around from left to right edges
        if(this.x <= 0 - this.width)
        {
            this.reset();
        }
    }

    setSpeed(i) {
        this.moveSpeed = i;
    }

    addSpeed(i) {
        this.moveSpeed += i;
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}