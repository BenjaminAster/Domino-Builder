new p5(function (p) {

  "use strict";

  let pFieldWidth;
  let pFieldHeight;
  let dotDist;

  let dotSize;

  //let dmnArray = [[]]; // dmn = domino
  let horizontal = true;
  let uMouseX;
  let uMouseY;
  let crrLay = 0; // current layer
  let uMouseValid = false;

  let stackLayers = 1;


  p.setup = function () {
    p.createCanvas(p.windowWidth / 2 - g.border, p.windowHeight - g.border);
    // (p.windowWidth / 2 - 10, p.windowHeight - 10);

    p.windowResized();
  }

  p.draw = function () {


    p.background(0);

    uMouseValid = true;
    uMouseX = p.round(p.mouseX / dotDist) - 1;
    uMouseY = p.round(p.mouseY / dotDist) - 1;

    if (horizontal) {
      if (uMouseX < 1 || uMouseX >= g.uFieldWidth) {
        uMouseValid = false;
      }
      if (uMouseY < 0 || uMouseY > g.uFieldHeight) {
        uMouseValid = false;
      }
    } else {
      if (uMouseX < 0 || uMouseX > g.uFieldWidth) {
        uMouseValid = false;
      }
      if (uMouseY < 1 || uMouseY >= g.uFieldHeight) {
        uMouseValid = false;
      }
    }


    p.strokeWeight(dotSize / 3);
    p.stroke(0x33);
    p.noFill();
    let dmnWidth = 0.15;

    if (crrLay != 0) {
      for (let i = 0; i < g.dmnArray[crrLay - 1].length; i++) {
        let x = g.dmnArray[crrLay - 1][i].x;
        let y = g.dmnArray[crrLay - 1][i].y;

        if (g.dmnArray[crrLay - 1][i].h) {
          p.rect((x - dmnWidth) * dotDist, (y + 1 - dmnWidth) * dotDist, 2 * (1 + dmnWidth) * dotDist, 2 * dmnWidth * dotDist);
        } else {
          p.rect((x + 1 - dmnWidth) * dotDist, (y - dmnWidth) * dotDist, 2 * dmnWidth * dotDist, 2 * (dmnWidth + 1) * dotDist);
        }
      }
    }

    dmnWidth = 0.15;
    p.stroke(255);
    p.strokeWeight(dotSize / 6);
    p.fill("#22c");
    dmnWidth = 0.15;

    for (let i = 0; i < g.dmnArray[crrLay].length; i++) {
      //stroke("#22f");

      let x = g.dmnArray[crrLay][i].x;
      let y = g.dmnArray[crrLay][i].y;

      if (g.dmnArray[crrLay][i].h) {
        p.rect((x - dmnWidth) * dotDist, (y + 1 - dmnWidth) * dotDist, 2 * (1 + dmnWidth) * dotDist, 2 * dmnWidth * dotDist);
      } else {
        p.rect((x + 1 - dmnWidth) * dotDist, (y - dmnWidth) * dotDist, 2 * dmnWidth * dotDist, 2 * (dmnWidth + 1) * dotDist);
      }
    }

    if (uMouseValid) {

      let col = p.color("#0a0");


      let current3Points = [];

      if (horizontal) {
        current3Points = [
          { x: uMouseX - 1, y: uMouseY },
          { x: uMouseX, y: uMouseY },
          { x: uMouseX + 1, y: uMouseY }];
      } else {
        current3Points = [
          { x: uMouseX, y: uMouseY - 1 },
          { x: uMouseX, y: uMouseY },
          { x: uMouseX, y: uMouseY + 1 }];
      }

      for (let pos = 0; pos < g.dmnArray[crrLay].length; pos++) {
        let x = g.dmnArray[crrLay][pos].x;
        let y = g.dmnArray[crrLay][pos].y;
        let h = g.dmnArray[crrLay][pos].h;

        if (x == uMouseX && y == uMouseY && h == horizontal) {
          col = p.color("#ff0");

        } else {

          let dmn3Points = [];

          if (h) {
            dmn3Points = [
              { x: x - 1, y: y },
              { x: x, y: y },
              { x: x + 1, y: y }];
          } else {
            dmn3Points = [
              { x: x, y: y - 1 },
              { x: x, y: y },
              { x: x, y: y + 1 }];
          }

          for (let i = 0; i < current3Points.length; i++) {
            for (let j = 0; j < dmn3Points.length; j++) {
              if (current3Points[i].x == dmn3Points[j].x && current3Points[i].y == dmn3Points[j].y) {
                col = p.color("#f33");
                uMouseValid = false;
              }
            }
          }
        }
      }
      g.selectedDmn = {
        x: uMouseX,
        y: uMouseY,
        z: crrLay,
        v: true,
        h: horizontal,
        c: col
      };

      let markingWidth = 0.25;

      p.stroke(col);
      p.strokeWeight(dotSize / 3);
      p.noFill();

      if (horizontal) {
        p.rect((uMouseX - markingWidth) * dotDist, (uMouseY + 1 - markingWidth) * dotDist, 2 * (1 + markingWidth) * dotDist, 2 * markingWidth * dotDist, dotSize / 2);
      } else {
        p.rect((uMouseX + 1 - markingWidth) * dotDist, (uMouseY - markingWidth) * dotDist, 2 * markingWidth * dotDist, 2 * (markingWidth + 1) * dotDist, dotSize / 2);
      }


    } else {
      g.selectedDmn.v = false;
    }

    p.noStroke();
    p.fill(0x22);

    for (let row = 0; row <= g.uFieldHeight; row++) {
      for (let clm = 0; clm <= g.uFieldWidth; clm++) {
        p.circle((clm + 1) * dotDist, (row + 1) * dotDist, dotSize);
      }
    }

    p.strokeWeight(1);
    p.stroke(255);
    p.noFill();
    let dist = 0.4;
    p.rect((1 - dist) * dotDist, (1 - dist) * dotDist, (g.uFieldWidth + 2 * dist) * dotDist, (g.uFieldHeight + 2 * dist) * dotDist);

    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(dotSize * 1.7);
    p.text("Layer: " + (crrLay + 1) + " / " + g.dmnArray.length + "  –  Stack layers: " + stackLayers, dotSize, dotSize);
    // — – -



    g.bLoop ? p.loop() : p.noLoop();

  }


  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth / 2 - g.border, p.windowHeight - g.border);

    dotDist = p.min(p.width / (g.uFieldWidth + 2), p.height / (g.uFieldHeight + 2));


    /*
    pFieldWidth = dotDist * (g.uFieldWidth + 2);
    pFieldHeight = dotDist * (g.uFieldHeight + 2);
    */

    dotSize = dotDist / 6;
  }


  p.changeLayer = function (down) {
    if (down) { // Down
      if (crrLay > 0) {
        if (crrLay == g.dmnArray.length - 1 && g.dmnArray[crrLay].length == 0) {
          g.dmnArray.pop();
        }
        crrLay--;
      }
    } else { // Up
      crrLay++;
      if (crrLay >= g.dmnArray.length) {
        g.dmnArray.push([]);
      }
    }
    //p.print(g.dmnArray.length);
  }

  p.keyPressed = function () {
    if (p.keyCode == p.ESCAPE) {
      g.bLoop = !g.bLoop;
    }

    if (p.key == 'x' || p.key == ' ') {
      horizontal = !horizontal;
    }

    if (p.key == 'y') {
      p.changeLayer(true);
    }
    else if (p.key == 'c') {
      p.changeLayer(false);
    }

    if (p.key == '+') {
      stackLayers++;
      //p.print("stackLayers: ", stackLayers);
    } else if (p.key == '-') {
      stackLayers--;
      stackLayers = p.constrain(stackLayers, 1, 9999);
      //p.print("stackLayers: ", stackLayers);
    }

    else if (p.key == '#') {
      for (let lay = g.dmnArray.length; lay < crrLay + stackLayers; lay++) {
        g.dmnArray.push([]);
        //p.print("pushed.");
      }
      for (let lay = crrLay; lay > crrLay - stackLayers; lay--) {
        g.dmnArray[lay + stackLayers] = [];
        for (let i = 0; i < g.dmnArray[lay].length; i++) {
          let temp = g.dmnArray[lay][i];
          g.dmnArray[lay + stackLayers].push(temp);
        }
      }
      crrLay += stackLayers;
    }



  }

  p.mousePressed = function () {
    //p.print(g.dmnArray);
    if (uMouseValid && p.mouseButton == p.LEFT) {

      let dmn = {
        x: uMouseX,
        y: uMouseY,
        h: horizontal
      };

      let remove = false;

      for (let i = g.dmnArray[crrLay].length - 1; i >= 0; i--) {
        if (g.dmnArray[crrLay][i].x == dmn.x && g.dmnArray[crrLay][i].y == dmn.y && g.dmnArray[crrLay][i].h == dmn.h) {
          g.dmnArray[crrLay].splice(i, 1);
          remove = true;
        }
      }

      if (!remove) {
        g.dmnArray[crrLay].push(dmn);
      }
    }

    if (p.mouseButton == p.CENTER) {
      horizontal = !horizontal;
    }
  }

  p.mouseWheel = function (event) {

    if (event.delta > 0) { // Down
      p.changeLayer(true);
    } else { // Up
      p.changeLayer(false);
    }
  }



  // declare here any variables that should be global to your sketch
  // JS has function level scope so you don't have
  // to worry about this polluting the other sketches
  // DO NOT attach variables/methods to p!!!
  //var colour = "#f33";

  /*
  p.setup = function () {
    p.createCanvas(600, 400);
  };
 
  p.draw = function () {
    p.background(colour);
  };
 
  p.mousePressed = function () {
    console.info("sketch01__");
    colour = (colour + 16) % 256;
    console.info("  X=",GlobalVars.x," and now adding +5");
    GlobalVars.x += 5;
  };
  */

},
  // This second parameter targets a DOM 'node' - i.e.
  // an element in your hard-coded HTML or otherwise added via a script.
  // You can pass a direct reference to a DOM node or the element's 
  // id (simplest to manually set this in the HTML) can be used, as here:
  "sketch2D");


