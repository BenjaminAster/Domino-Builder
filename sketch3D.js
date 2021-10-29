new p5(function (p) {
  "use strict";

  let update = true;
  let dotDist = 20;

  // Camera:
  let rotX = 0;
  let rotZ = 0;

  let tmX;
  let tmY;

  let camX; //absolute
  let camY;
  let camZ;

  let camCenterX; //relative
  let camCenterY;
  let camCenterZ;

  let camUpX; // relative
  let camUpY;
  let camUpZ;

  const camPosChange = 4;
  const camRotChange = 0.6;

  p.setup = function () {


    p.createCanvas(p.windowWidth / 2 - g.border, p.windowHeight - g.border, p.WEBGL);
    //p.createCanvas(400, 400, p.WEBGL);

    camX = g.uFieldWidth * dotDist * 0.5;
    camY = g.uFieldHeight * dotDist * 1.3;
    camZ = 10 * dotDist;

    //p.print("cam position: ", camX, camY, camZ);


    /*
    camX = -100;
    camY = -100;
    camZ = 100;
    */

    tmX = 0; //p.width / 1;
    tmY = p.height * 0.36;

    rotZ = p.map(tmX, 0, p.width - 1, p.TWO_PI, 0) * camRotChange;
    rotX = p.map(tmY, 0, p.height - 1, -p.HALF_PI, p.HALF_PI) * camRotChange;

    //rotX = p.constrain(rotX, -p.HALF_PI, p.HALF_PI);

    camCenterX = p.cos(rotZ) * p.cos(rotX);
    camCenterY = p.sin(rotZ) * p.cos(rotX);
    camCenterZ = p.sin(rotX);

    camUpX = p.cos(rotZ) * p.cos(rotX - p.QUARTER_PI);
    camUpY = p.sin(rotZ) * p.cos(rotX - p.QUARTER_PI);
    camUpZ = p.sin(rotX - p.QUARTER_PI);
  }


  p.draw = function () {



    p.background(0);
    //p.resetMatrix();

    p.perspective(1, p.width / p.height, 0.1, 10000);

    if (p.keyIsPressed) {

      if (p.keyIsDown(p.unchar('W'))) {
        camX += camPosChange * p.cos(rotZ);
        camY += camPosChange * p.sin(rotZ);

      } else if (p.keyIsDown(p.unchar('S'))) {
        camX -= camPosChange * p.cos(rotZ);
        camY -= camPosChange * p.sin(rotZ);
      }
      if (p.keyIsDown(p.unchar('D'))) {
        camX += camPosChange * p.cos(rotZ + p.HALF_PI);
        camY += camPosChange * p.sin(rotZ + p.HALF_PI);

      } else if (p.keyIsDown(p.unchar('A'))) {
        camX -= camPosChange * p.cos(rotZ + p.HALF_PI);
        camY -= camPosChange * p.sin(rotZ + p.HALF_PI);
      }
      if (p.keyIsDown(p.unchar('E'))) {
        camZ += camPosChange;

      } else if (p.keyIsDown(p.unchar('Q'))) {
        camZ -= camPosChange;
      }

    }


    if (p.constrain(p.mouseX, 0, p.width) == p.mouseX && update && p.mouseIsPressed) {

      p.cursor("grab");

      //p.print("moved: ", p.movedX, p.movedY);

      tmX += p.movedX;
      tmY += p.movedY;

      //tmY = p.constrain(tmY, -p.height / (p.HALF_PI / camRotChange), p.height);

      //p.print("tmX: " + tmX + ", tmY: " + tmY);

      rotZ = p.map(tmX, 0, p.width - 1, p.TWO_PI, 0) * camRotChange;
      rotX = p.map(tmY, 0, p.height - 1, -p.HALF_PI, p.HALF_PI) * camRotChange;
      
      rotX = p.constrain(rotX, -p.HALF_PI, p.HALF_PI);

      //p.print("tmY: " + tmY + ", rotX: " + rotX);


      camCenterX = p.cos(rotZ) * p.cos(rotX);
      camCenterY = p.sin(rotZ) * p.cos(rotX);
      camCenterZ = p.sin(rotX);


      camUpX = p.cos(rotZ) * p.cos(rotX - p.QUARTER_PI);
      camUpY = p.sin(rotZ) * p.cos(rotX - p.QUARTER_PI);
      camUpZ = p.sin(rotX - p.QUARTER_PI);


    } else {
      p.cursor(p.ARROW);
      //p.print("arrow");
    }

    p.camera(camX, camY, camZ, camX + camCenterX, camY + camCenterY, camZ + camCenterZ, camUpX, camUpY, camUpZ);







    //   begin drawing  ***************************************


    p.stroke(255);
    p.strokeWeight(1.5);
    p.fill("#22a");

    let dmnWidth = dotDist / 5;

    for (let layer = 0; layer < g.dmnArray.length; layer++) {
      for (let i = 0; i < g.dmnArray[layer].length; i++) {
        let dmn = g.dmnArray[layer][i];

        p.push();
        p.translate(dmn.x * dotDist, dmn.y * dotDist, layer * dotDist);
        if (dmn.h) {
          p.scale(dotDist * 2 + dmnWidth, dmnWidth, dotDist);
        } else {
          p.scale(dmnWidth, dotDist * 2 + dmnWidth, dotDist);
        }
        p.box(1);
        p.pop();
      }
    }

    let borderDist = dmnWidth / 2;

    if (g.selectedDmn.v) {
      p.stroke(g.selectedDmn.c);
      p.strokeWeight(3);
      p.noFill();
      p.push();
      p.translate(g.selectedDmn.x * dotDist, g.selectedDmn.y * dotDist, g.selectedDmn.z * dotDist);

      if (g.selectedDmn.h) {
        p.scale(dotDist * 2 + dmnWidth + borderDist, dmnWidth + borderDist, dotDist + borderDist);
      } else {
        p.scale(dmnWidth + borderDist, dotDist * 2 + dmnWidth + borderDist, dotDist + borderDist);
      }
      p.box(1);
      p.pop();
    }

    p.push();
    p.stroke(255);
    p.strokeWeight(2);
    p.noFill();
    p.translate(-dotDist, -dotDist, -dotDist / 2 - 1);

    p.strokeWeight(1);
    p.stroke(255);
    p.fill(100);

    let dist = 0.4;
    p.rect((1 - dist) * dotDist, (1 - dist) * dotDist, (g.uFieldWidth + 2 * dist) * dotDist, (g.uFieldHeight + 2 * dist) * dotDist);

    let dotSize = dotDist / 6;

    for (let row = 0; row <= g.uFieldHeight; row++) {
      for (let clm = 0; clm <= g.uFieldWidth; clm++) {
        p.circle((clm + 1) * dotDist, (row + 1) * dotDist, dotSize);
      }
    }
    p.pop();

    g.bLoop ? p.loop() : p.noLoop();

	}
	

  p.keyReleased = function () {
		if (p.key == 'r') {
      update = !update;
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth / 2 - g.border, p.windowHeight - g.border);
  }
}, "sketch3D");
