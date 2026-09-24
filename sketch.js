let numShapes = 5; // shape 0 as bottom base, doesn't lean or bounce

let type = [4, 0, 1, 2, 3]; // 0 = circle, 1 = square, 2 = dome thign (half circle), 3 =diamond, 4 = pill
let scale = [1, 1, 1, 1, 1];

let unit = 90;
let tiltAmount = 0.12; // how much each shape leans
let tiltSpeed = 0.03;  // speed of leaning left /right
let tiltOffset; // each shape leans at diff moment (so not synced )

let gravity = 1;
let jumpPower = -7; // how hard each shape "pops" when user clicks

let upAmount = [0, 0, 0, 0, 0]; // how far up in the air each shape is right now
let speed = [0, 0, 0, 0, 0];    // how fast it's moving up or down
let wait = [0, 0, 0, 0, 0];     // frames left before this shape starts falling
//-----------------------

function setup() {
  createCanvas(800, 700);
  rectMode(CENTER);
  ellipseMode(CENTER);
  tiltOffset = [0, 0, HALF_PI, PI, PI + HALF_PI]; // shape 0 not used, base doesn't lean
}

function draw() {
  background(220);

  let x = width / 2;
  let y = 600; // the "ground"

  // from the bottom shape up to the top one
  for (let i = 0; i < numShapes; i++) {
    let shapeSize = unit * scale[i];
    let angle = 0;

    if (i !== 0) {
      // angle = sin(frameCount * tiltSpeed) * tiltAmount;
      /* ^^old, all 4 shapes swayed in perfect sync since they
      all just used frameCount with nothing to tell them apart.
      
      Added tiltOffset[i] below fixed it so each one starts at a
      different point in the same wave */
      angle = sin(frameCount * tiltSpeed + tiltOffset[i]) * tiltAmount;

      // falling/bouncing - speed builds up from gravity until it lands
      if (wait[i] > 0) {
        wait[i]--;
      } else if (!(upAmount[i] === 0 && speed[i] === 0)) {
        speed[i] += gravity;
        upAmount[i] += speed[i];
        if (upAmount[i] > 0) {
          upAmount[i] = 0;
          speed[i] = 0;
        }
      }
    }

    push();
    translate(x, y + upAmount[i]);
    rotate(angle);
    let footprint = drawShape(type[i], shapeSize);
    pop();

    // y -= footprint;
   
    x += sin(angle) * footprint;
    y -= cos(angle) * footprint;
  }

  fill(100);
  textSize(16);
  textAlign(CENTER);
  text("Click Anywhere to Change!", width / 2, 670);
}


function drawShape(shapeType, shapeSize) {
  noStroke();
  let footprint = shapeSize; // most shapes just fill their whole box

  if (shapeType === 0) {
    // circle, this matches ellipse(width/2, 455, 90) from my original sketch
    fill(66, 133, 244);
    ellipse(0, -shapeSize / 2, shapeSize, shapeSize);

  } else if (shapeType === 1) {
    // square, this matches rect(width/2, 364, 90, 90)
    fill(251, 140, 0);
    rect(0, -shapeSize / 2, shapeSize, shapeSize);

  } else if (shapeType === 2) {
   
    fill(0, 172, 193);
    footprint = shapeSize / 2;
    arc(0, -shapeSize / 2, shapeSize, shapeSize, 0, PI);

  } else if (shapeType === 3) {

    fill(156, 39, 176);
    push();
    translate(0, -shapeSize / 2);
    rotate(HALF_PI / 2);
    let side = shapeSize / sqrt(2);
    rect(0, 0, side, side);
    pop();

  } else if (shapeType === 4) {
 
    fill(67, 160, 71);
    rect(0, -shapeSize / 2, shapeSize * 3.2, shapeSize, shapeSize / 2);
  }

  return footprint;
}

// New shapes/sizes on click and makes top 4 shapes jumpp up
function mousePressed() {
  for (let i = 0; i < numShapes; i++) {
    type[i] = floor(random(5));
    scale[i] = random(0.7, 1.4);

    if (i !== 0) {
      // upAmount[i] = -40;
      /* snapped the shapes straight up in one frame (glitchy)
      speed + gravity below makes it actually launch and fall instead */
      
      speed[i] = jumpPower;

      // wait[i] = 0;
      // ^ old version (all 4 shapes jumped and landed at the exact time, looked kinda robotic)
      wait[i] = i * 3; // staggers
    }
  }
}
