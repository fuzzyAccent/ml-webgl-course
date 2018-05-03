let img;
let circle;
let trainX = [];
let trainY = [];
let img_flag = false;
function setup(){
  createCanvas(600, 600);
  background(0);
}

function Circle(c, r){
  this.c = c;
  this.r = r;

  this.show = function(){
    ellipse(this.c.x, this.c.y, 2 * r, 2 * r);
  }
}

function draw(){
  if(mouseIsPressed && keyIsPressed){
    img_flag = false;
    let d = dist(currentCenter.x, currentCenter.y, mouseX, mouseY);
    background(0);
    circle = new Circle(currentCenter, d);
  }

  if(circle && !img_flag){
    circle.show();
  } else if (img_flag) {
    console.log("switch to img flag");
    colorMode(RGB, 255);
    image(img, 0, 0);
  }
}

let currentCenter;

function mousePressed(){
  currentCenter = createVector(mouseX, mouseY);
}

let btn = document.getElementById("send");

btn.onclick = () => {
  img = get();
  img.loadPixels();
  let counter = 0;
  for(let i = 0; i < floor(img.pixels.length / 4); i++){
    let bright = img.pixels[i * 4];
    if(bright/255.0 >= 0.5){
      img.pixels[i * 4] = 0;
      img.pixels[i * 4 + 1] = 255;
      img.pixels[i * 4 + 2] = 0;
      counter++;
    }
  }
  img_flag = true;
  trainX.push(floor(circle.r));
  trainY.push(counter);
  document.getElementById("datasetSize").innerHTML = trainX.length;
}

let trn_btn = document.getElementById("train");
trn_btn.onclick = function(){
  train(trainX, trainY);
}
