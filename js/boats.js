class Boats {
    constructor(x, y, w, h, boatPos, boatAnimation) {
        this.body = Bodies.rectangle(x, y, w, h);
        this.w = w;
        this.h = h;

        this.isBroken = false
        this.speed = 0.05
        this.animation = boatAnimation
        this.image = loadImage("./assets/boat.png");
        this.boatPosition = boatPos;
        World.add(world, this.body);
    }

    animate() {
        this.speed += 0.05

    }

    removeBoats(i) {
        this.animation = brokenBoatAnimation;
        this.speed = 0.05;
        this.w = 300;
        this.h = 300;
        this.isBroken = true;
        setTimeout(() => {
            World.remove(world, boats[i].body)
            delete boats[i]
        }, 2000);


    }

    display() {
        var angle = this.body.angle;
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length)

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPosition, this.w, this.h);
        pop();


    }


}