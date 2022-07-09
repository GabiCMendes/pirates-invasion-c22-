class CannonBall {
    constructor(x, y) {

       
        var options = {
            isStatic: true
        }

        this.raio = 24
        this.body = Bodies.circle(x, y, this.raio, options)
        this.image = loadImage("./assets/cannonball.png")
        World.add(world, this.body)
        this.tragectory = []
    
        this.speed = 0.05;
        this.animation = [this.image];
        this.isSink = false;
    
    }

    animate() {
        this.speed += 0.05;
      }
    
    shoot() {
        var newAngle = cannon.angle - 28
        newAngle = newAngle * (3.14 / 180)
        var velocity = p5.Vector.fromAngle(newAngle)
        velocity.mult(0.5)
        Matter.Body.setStatic(this.body, false)
        Matter.Body.setVelocity(this.body, { x: velocity.x * (180 / 3.14), y: velocity.y * (180 / 3.14) })
    }
    
    removeCannonBall(index){
        this.isSink = true;
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 });

    this.animation = waterSplashAnimation;
    this.speed = 0.05;
    this.r = 150;
        setTimeout(() => {
           World.remove(world,this.body)
         delete cannonBall [index]
       }, 1000);
   
      }
    
    display() {
        var pos = this.body.position
        var index = floor(this.speed % this.animation.length);
        if (this.isSink) {
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            imageMode(CENTER);
            image(this.animation[index], 0, 0, this.r, this.r);
            pop();   
        } else {
            push()
            imageMode(CENTER)
            image(this.image, pos.x, pos.y, this.raio, this.raio)
            pop()   
        }
      

      
        if (this.body.velocity.x > 0 && this.body.position.x > 250) {
            var position = [pos.x, pos.y]
            this.tragectory.push(position)
        }
        for (let index = 0; index < this.tragectory.length; index++) {
            image(this.image, this.tragectory[index][0], this.tragectory[index][1], 5, 5)

        }

    
    
    }

}