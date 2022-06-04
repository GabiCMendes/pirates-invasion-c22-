class CannonBall {
    constructor(x, y) {

        var options = {
            isStatic: true
        }

        this.raio = 24
        this.body = Bodies.circle(x, y, this.raio, options)
        this.image = loadImage("./assets/cannonball.png")
        World.add(world, this.body)
       }
     
       shoot (){
        var newAngle = cannon.angle -28
        newAngle = newAngle*(3.14/180)
        var velocity = p5.Vector.fromAngle(newAngle)
        velocity.mult(0.5)
        Matter.Body.setStatic(this.body,false)
        Matter.Body.setVelocity(this.body,{x:velocity.x*(180/3.14), y:velocity.y*(180/3.14)})



       }
       display() {
        var pos = this.body.position
        push()
        imageMode(CENTER)
        image(this.image, pos.x, pos.y, this.raio, this.raio)
        pop()
        
    }

}