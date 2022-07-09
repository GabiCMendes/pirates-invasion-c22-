const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

let engine, world;

var bgImg;
var ground;
var tower, towerImg;
var cannon;
var angle = 15;
var cannonBalls = [];
var boats = []
var boatAnimation = []
var boatJson
var boatPng
var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;
var bgMusic
var explosion
var cannonWater
var laugh
var isGameOver = false
var isLaughing = false
var score = 0

function preload() {
  bgImg = loadImage("./assets/background.gif")
  towerImg = loadImage("./assets/tower.png")
  boatJson = loadJSON("./assets/boat/boat.json")
  boatPng = loadImage("./assets/boat/boat.png")
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
  waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
  waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");
  bgMusic = loadSound("./assets/sounds/background_music.mp3")
  explosion = loadSound("./assets/sounds/cannon_explosion.mp3")
  cannonWater = loadSound("./assets/sounds/cannon_water.mp3")
  laugh = loadSound("./assets/sounds/pirate_laugh.mp3")

}


function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  var options = {
    isStatic: true
  }

  //criando o corpo do solo
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  //criando o corpo da torre
  tower = Bodies.rectangle(160, 350, 160, 310, options)
  World.add(world, tower)
  cannon = new Cannon(180, 110, 130, 100, angle)

  var boatFrames = boatJson.frames

  for (let i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position
    var img = boatPng.get(pos.x, pos.y, pos.w, pos.h)
    boatAnimation.push(img)

  }
  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(bgImg, 0, 0, width, height)
  if (!bgMusic.isPlaying()) {
    bgMusic.play()
    bgMusic.setVolume(0.4)
  }
  
  
  Engine.update(engine);

  // exibindo o solo na tela
  rect(ground.position.x, ground.position.y, width * 2, 1)

  // exibindo a torre na tela
  push() //inicia uma nova configuração
  imageMode(CENTER)
  image(towerImg, tower.position.x, tower.position.y, 160, 310)
  pop() //volta para a configuração antiga
  for (let i = 0; i < cannonBalls.length; i++) {
    showCannonBalls(cannonBalls[i], i)
    collisionWithBoat(i)
  }
  cannon.display()

  showBoats()

  // posição do mouse na tela
  textSize(40)
  text("score:"+score,1000,60)

}

function keyReleased() {
  if (keyCode == DOWN_ARROW) {
    cannonBalls[cannonBalls.length - 1].shoot()
  explosion.play()
 
  }
}


function keyPressed() {
  if (keyCode == DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y)
    cannonBalls.push(cannonBall)
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display()
    if (ball.body.position.x >= width) {
      World.remove(world, cannonBalls[index].body)
      cannonBalls.splice(index, 1)
    }
    if (ball.body.position.y >= height - 50) {
      ball.removeCannonBall(index)
      cannonWater.play()
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] == undefined || boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-40, -70, -70, -80, -20]
      var position = random(positions)
      var boat = new Boats(width - 79, height - 60, 170, 170, position, boatAnimation)
      boats.push(boat)
    }
    for (let i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, { x: -0.9, y: 0 })
        boats[i].display()
        boats[i].animate()
        var colission = Matter.SAT.collides(this.tower, boats[i].body)
        if (colission.collided) {
          if (!isLaughing && !laugh.isPlaying()) {
            laugh.play()
            isLaughing = true
          }
          isGameOver = true
          gameOver()

        }
      }

    }
  } else {
    var boat = new Boats(width - 79, height - 60, 170, 170, -80, boatAnimation)
    boats.push(boat)
  }
}

function collisionWithBoat(index) {
  for (let i = 0; i < boats.length; i++) {
    if (cannonBalls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(cannonBalls[index].body, boats[i].body)
      if (collision.collided) {
        boats[i].removeBoats(i)
        World.remove(world, cannonBalls[index].body)
        cannonBalls.splice(index, 1)
        score += 5
      }
    }
  }
}

function gameOver() {
  swal(
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigada por jogar!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
