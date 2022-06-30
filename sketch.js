var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;
var zombieGroup;
var invisibleGround, invisibleRoof;
var heart1, heart2, heart3, heart1IMG, heart2IMG, heart3IMG
var bullets =50;
var gameState ="fight"
var bullet, bulletGroup;
var score = 0;
var life = 3;
var win, lose, expSound;
function preload(){


  win = loadSound("assets/win.mp3")
  lose= loadSound("assets/lose.mp3")
  expSound= loadSound("assets/explosion.mp3")
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")
  zombieImg = loadImage("assets/zombie.png")


  heart1IMG =loadImage("assets/heart_1.png")
  heart2IMG =loadImage("assets/heart_2.png")
  heart3IMG =loadImage("assets/heart_3.png")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
// creando grupo para los zombies
zombieGroup = new Group();
bulletGroup = new Group();  

invisibleGround = createSprite(displayWidth-1150, 1000, 10,10);
invisibleGround.visible = false;

invisibleRoof = createSprite(displayWidth-1150, 500, 10,10);
invisibleRoof.visible = false;

heart1 = createSprite(displayWidth-350,40,20,20);
heart1.visible = false;
heart1.addImage("heart1",heart1IMG);
heart1.scale = 0.5;

heart2 = createSprite(displayWidth-380,40,20,20);
heart2.visible = false;
heart2.addImage("heart2",heart2IMG);
heart2.scale = 0.5;

heart3 = createSprite(displayWidth-420,40,20,20);

heart3.addImage("heart3",heart3IMG);
heart3.scale = 0.5;


//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

  
}

function draw() {
  background(0); 

if(gameState === "fight"){
 if(life === 3){
  heart3.visible = true;
  heart2.visible = false;
  heart1.visible = false;
 }
 if(life === 2){
  heart2.visible = true;
  heart3.visible = false;
  heart1.visible = false;
 }
 if(life === 1){
  heart1.visible = true;
  heart2.visible = false;
  heart3.visible = false;
 }
 if(life === 0){
  
  gameState = "lost"
  lose.play();
 }
 if(score === 50){
  gameState = "won";
  win.play();
 }

player.collide(invisibleGround);
player.collide(invisibleRoof);




  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed



if(keyWentDown("space")){
  bullet = createSprite(displayWidth- 1150, player.y-30,20,10)
  bullet.velocityX = 20

  bulletGroup.add(bullet)
  player.depth= bullet.depth
  player.depth= player.depth+2
  player.addImage(shooter_shooting)
  bullets=bullets-1
  expSound.play();


 
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){

  player.addImage(shooterImg)

}
if(bullets === 0){
  gameState = "bullet"
  lose.play();
}


//destruir al zombie con balas
if(zombieGroup.isTouching(bulletGroup)){
  for(var i = 0; i<zombieGroup.length; i++){
    if(zombieGroup[i].isTouching(bulletGroup)){
      zombieGroup[i].destroy();
      bulletGroup.destroyEach();
      expSound.play();
      score = score + 2;
    }
  }
}



if (zombieGroup.isTouching(player)){
  lose.play();
  for(var i = 0; i<zombieGroup.length; i++){
    if (zombieGroup[i].isTouching(player)){
      zombieGroup[i].destroy();
      life = life -1;

    }
  }
  
}
//llamando funcion para generar zombies
enemy();

}

drawSprites();


textSize(22)
fill("white")
text("balas: "+bullets, displayWidth -150, displayHeight/2 -250)
text("score: "+score, displayWidth -150, displayHeight/2 -220)
text("vida: "+life, displayWidth-150, displayHeight/2 -280)
//perder
if(gameState === "lost"){
  textSize(200);
  fill("red")
  text("GameOver",400,400)

  zombieGroup.destroyEach();
  player.destroy();

}
//ganar
else if(gameState === "won"){
  textSize(200);
  fill("blue")
  text("You Win",400,400)

  zombieGroup.destroyEach();
  player.destroy();
}
//destruir todo
else if(gameState === "bullet"){
  textSize(100);
  fill("yellow")
  text("You are out of bullets",400,400)

  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();
}

}

function enemy(){
  if (frameCount%60 === 0){
    zombie = createSprite(random(1500,2000), random(500,1000),40,40);
    zombie.addImage(zombieImg);
    zombie.scale = 0.20;
    zombie.velocityX = -3;
    zombie.debug = true;
    zombie.setCollider("rectangle",0,0,400,400);
    zombie.lifetime = 600;
    zombieGroup.add(zombie)

  }
}