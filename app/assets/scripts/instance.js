import otfFile from "../fonts/font.otf";
import opentype from "opentype.js";
import p5 from "p5";
export default (sketch) => {
  let font,
    sampleFactorSlider,
    saveButton,
    speedXSlider,
    speedYSlider,
    colorPicker,
    textColorPicker,
    bgColor,
    textSizeSlider,
    sinXSlider,
    sinYSlider,
    xInitSlider,
    yInitSlider,
    spacingSlider,
    bgColourPicker,
    fillCheckbox,
    strokeWeightSlider,
    rainbow,
    fpsCheckbox,
    boundCheckbox,
    crosshairCheckbox,
    centerButton,
    savePresetButton,
    loadPresetButton,
    fillTextStrokeCheckbox,
    sinX,
    sinY,
    xAnim,
    yAnim,
    fillColor,
    lineColor,
    fontInput;

  let strokeWeight = 1;
  let controlPanel = document.querySelector(".controlpanel");
  let controlpanelWidth = controlPanel.clientWidth;
  let controlpanelHeight = controlPanel.clientHeight;
  let showCrosshair = false;
  let textArray = [];
  let w = window.innerWidth;

  let isMobile = w < 600;
  // !isMobile ? (w = w - controlpanelWidth) : null;
  let h = window.innerHeight - (isMobile ? controlpanelHeight : 0);

  let fontSize = isMobile ? w / 2.8 : w / 4;
  let posX = 0.01;
  let posY = 0;
  let innerText = "HEAT";
  let sinXRatio = 53.3;
  let sinYRatio = 0;
  let spacing = 0.95;
  let xInit = 0;
  let yInit = 0;

  let fillText = true;
  let rainbowMode = false;
  let textInput;
  let textX;
  let textY;
  let textBoundary;
  let arraySampleFactor = 1;
  let showFps = false;
  let showBoundary = false;
  let dragging = false;
  let fillTextStroke = false;
  let presets = [];

  // EVENT LISTENERS

  sketch.mouseDragged = (e) => {
    const {mouseX, mouseY} = sketch;
    if (e.srcElement.className === "p5Canvas") {
      if (mouseX > 200 && mouseX < w && mouseY > 0 && mouseY < h) {
        dragging = true;
        textX = mouseX;
        textY = mouseY;
        setTimeout(textSetup(), 100);
      }
    }
  };
  sketch.mouseReleased = () => {
    dragging = false;
  };
  sketch.windowResized = () => {
    setTimeout(() => {
      sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
      w = sketch.width;
      h = sketch.height;
      textX = w / 2;
      textY = h / 2;
      textSetup();
    }, 50);
  };

  // INPUT HANDLERS

  function handleFile(file) {
    console.log(font);
    const p5Font = new p5.Font();
    console.log(p5Font);
    opentype.load(file.data, function (err, newFont) {
      if (err) {
        alert("Could not load font: " + err);
      } else {
        font = sketch.loadFont(file.data);
      }
    });
    textX = sketch.width / 2;
    textY = sketch.height / 2;
    changeText();
  }

  function saveImages(num = 1) {
    sketch.noLoop();
    for (let i = 0; i < num; i++) {
      sketch.save("render/myCanvas" + sketch.frameCount + ".jpg");
    }
    sketch.loop();
  }

  function handleInput(e) {
    e.preventDefault();
    innerText = this.value();
    //changeText();
  }

  // TEXT SETUP
  function textSetup() {
    sketch.textStyle(sketch.BOLD);
    sketch.textSize(fontSize);
    sketch.fill(255);
    textBoundary = font.textBounds(innerText, textX, textY, fontSize);

    textX -= textBoundary.w / 2;
    textY += textBoundary.h / 2;
    textBoundary = font.textBounds(innerText, textX, textY, fontSize);

    textArray = font.textToPoints(innerText, textX, textY, fontSize, {
      sampleFactor: sampleFactorSlider.value(),
      simplifyThreshold: 0,
    });
  }

  function changeText() {
    textBoundary = font.textBounds(innerText, textX, textY, fontSize);
    textArray = font.textToPoints(innerText, textX, textY, fontSize, {
      sampleFactor: sampleFactorSlider.value(),
      simplifyThreshold: 0,
    });
  }

  // PRESETS

  function savePreset() {
    presets.push({
      presetArray: textArray,
      fontSize,
      speedX: speedXSlider.value(),
      speedY: speedYSlider.value(),
      sinXRatio,
      sinYRatio,
      xInit,
      yInit,
      spacing,
      arraySampleFactor,
      storedText: innerText,
      lineColor: colorPicker.value(),
      fillColor: textColorPicker.value(),
      bgColor,
      storedX: textX,
      storedY: textY,
      fillText,
    });
  }

  function loadPreset() {
    console.log(presets[presets.length - 1]);
    let {
      presetArray,
      fontSize,
      speedX,
      speedY,
      sinXRatio,
      sinYRatio,
      xInit,
      yInit,
      spacing,
      arraySampleFactor,
      storedText,
      lineColor,
      fillColor,
      bgColor,
      storedX,
      storedY,
      fillText,
    } = presets[presets.length - 1];
    textArray = presetArray;
    textSizeSlider.value(fontSize);
    speedXSlider.value(speedX);
    speedYSlider.value(speedY);
    sinXSlider.value(sinXRatio);
    sinYSlider.value(sinYRatio);
    xInitSlider.value(xInit);
    yInitSlider.value(yInit);
    spacingSlider.value(spacing);
    sampleFactorSlider.value(arraySampleFactor);
    colorPicker.value(lineColor);
    textColorPicker.value(fillColor);
    bgColourPicker.value(bgColor);
    fillCheckbox.checked(fillText);
    fillText = fillText;
    textX = storedX;
    textY = storedY;
    textInput.value(storedText);
    innerText = storedText;
  }

  // MAKE LABELS FOR UI
  function updateLabels(labels) {
    labels.forEach(function (label) {
      let elementLabel = document.createElement("label");
      label.element.name = label.label;
      const id = label.element.name;
      const formgroup = document.createElement("div");
      formgroup.classList.add("formgroup");
      label.element.elt.id = id;
      elementLabel.setAttribute("for", id);
      //elementLabel.innerText = label.label + ": " + label.element.value();
      elementLabel.innerText = label.label;
      if (isMobile) {
        document.querySelector(".controlpanel").appendChild(formgroup);
        formgroup.appendChild(elementLabel);
        formgroup.appendChild(label.element.elt);
        fontInput.hide();
      } else {
        document.querySelector(".controlpanel").appendChild(elementLabel);
        label.element.parent(sketch.select(".controlpanel"));
      }
    });
  }

  // SETUP UI
  function setupControls() {
    const controlPanel = sketch.select(".controlpanel");
    textSizeSlider = sketch.createSlider(12, 1024, fontSize, 12);
    textSizeSlider.changed(changeText);
    speedXSlider = sketch.createSlider(0, 0.5, posX, 0.01);
    speedYSlider = sketch.createSlider(0, 0.5, posY, 0.01);
    sinXSlider = sketch.createSlider(0, w, sinXRatio, 0.1);
    sinYSlider = sketch.createSlider(0, h, sinYRatio, 0.1);
    xInitSlider = sketch.createSlider(-w, w, xInit, 0.1);
    yInitSlider = sketch.createSlider(-h, h, yInit, 0.1);
    strokeWeightSlider = sketch.createSlider(1, 15, strokeWeight, 1);

    spacingSlider = sketch.createSlider(0, 2, spacing, 0.05);
    sampleFactorSlider = sketch.createSlider(0.01, 1.5, arraySampleFactor, 0.1);
    sampleFactorSlider.changed(changeText);
    colorPicker = sketch.createColorPicker("#ff0048");
    textColorPicker = sketch.createColorPicker("#fff");
    bgColourPicker = sketch.createColorPicker("#3f3f3f");

    rainbow = sketch.createCheckbox("Rainbow Mode", rainbowMode);
    rainbow.changed(() => (rainbowMode = !rainbowMode));
    rainbow.parent(controlPanel);

    fillCheckbox = sketch.createCheckbox("Fill Text", fillText);
    fillCheckbox.changed(() => (fillText = !fillText));
    fillCheckbox.parent(controlPanel);

    fpsCheckbox = sketch.createCheckbox("FPS", showFps);
    fpsCheckbox.changed(() => (showFps = !showFps));
    fpsCheckbox.parent(controlPanel);

    crosshairCheckbox = sketch.createCheckbox("Crosshair", showCrosshair);
    crosshairCheckbox.changed(() => (showCrosshair = !showCrosshair));
    crosshairCheckbox.parent(controlPanel);

    fillTextStrokeCheckbox = sketch.createCheckbox(
      "Fill Text Stroke",
      fillTextStroke
    );
    fillTextStrokeCheckbox.changed(() => (fillTextStroke = !fillTextStroke));
    fillTextStrokeCheckbox.parent(controlPanel);

    boundCheckbox = sketch.createCheckbox("Bounding Box", showBoundary);
    boundCheckbox.changed(() => (showBoundary = !showBoundary));

    textInput = sketch.createInput(innerText);
    textInput.input(handleInput);
    textInput.parent(controlPanel);

    fontInput = sketch.createFileInput(handleFile);
    fontInput.parent(controlPanel);

    saveButton = sketch.createButton("Save Frame");
    saveButton.mousePressed(() => {
      saveImages(1);
    });
    saveButton.parent(controlPanel);

    centerButton = sketch.createButton("center text");
    centerButton.mousePressed(() => {
      textX = sketch.width / 2;
      textY = sketch.height / 2;
      textSetup();
    });
    centerButton.parent(controlPanel);

    savePresetButton = sketch.createButton("save state");
    savePresetButton.mousePressed(() => savePreset());
    savePresetButton.parent(controlPanel);

    loadPresetButton = sketch.createButton("load state");
    loadPresetButton.mousePressed(() => loadPreset());
    loadPresetButton.parent(controlPanel);

    const labels = [
      {
        label: "Animation Speed X",
        element: speedXSlider,
      },
      {
        label: "Animation Speed Y",
        element: speedYSlider,
      },
      {
        label: "Animation Range X",
        element: sinXSlider,
      },
      {
        label: "Animation Range Y",
        element: sinYSlider,
      },
      {
        label: "X Init",
        element: xInitSlider,
      },
      {
        label: "Y Init",
        element: yInitSlider,
      },
      {
        label: "Spacing",
        element: spacingSlider,
      },
      {
        label: "Stroke Weight",
        element: strokeWeightSlider,
      },
      {
        label: "Sample Factor",
        element: sampleFactorSlider,
      },
      {
        label: "Text Size",
        element: textSizeSlider,
      },
      {
        label: "Line Colour",
        element: colorPicker,
      },
      {
        label: "Text Fill",
        element: textColorPicker,
      },
      {
        label: "Background Colour",
        element: bgColourPicker,
      },
      {
        label: "",
        element: rainbow,
      },
      {
        label: "",
        element: fillCheckbox,
      },
      {
        label: "",
        element: fillTextStrokeCheckbox,
      },
      {
        label: "",
        element: crosshairCheckbox,
      },
      {
        label: "",
        element: fpsCheckbox,
      },
      {
        label: "",
        element: boundCheckbox,
      },
    ];

    if (w > 600) {
      labels.push({label: "Upload OpenType Font ", element: fontInput});
    }

    updateLabels(labels);
  }

  // MAKE ANIMATION FROM VERTICES
  function makeVertexAnimation() {
    textArray.map(function (val) {
      sketch.push();
      val.x = Math.floor(val.x);
      val.y = Math.floor(val.y);
      sinX = Math.sin(posX);
      sinY = Math.sin(posY);
      sketch.stroke(lineColor);
      sketch.strokeCap(sketch.ROUND);
      sketch.strokeWeight(strokeWeight);
      xAnim = (xInit + val.x + sinX * sinXRatio) * spacing;
      yAnim = (yInit + val.y + sinY * sinYRatio) * spacing;
      sketch.beginShape();
      sketch.vertex(val.x, val.y);
      sketch.vertex(xAnim, yAnim);
      sketch.endShape(sketch.CLOSE);
      sketch.pop();
    });
  }

  function makeRotateAnimation() {
    var len = textArray.length;

    while (len--) {
      let char = innerText[len % innerText.length];
      sketch.push();
      sketch.translate(textArray[len].x + xInit, textArray[len].y + yInit);
      sketch.noStroke();
      sketch.rectMode(sketch.CORNERS);
      sketch.fill(lineColor);
      sketch.textSize(fontSize / 20);
      sketch.text(char, 0, 0);
      sketch.pop();
    }
  }

  function makeVertexWhileLoop() {
    var len = textArray.length;
    while (len--) {
      sinX = Math.sin(posX);
      sinY = Math.sin(posY);
      xAnim = (xInit + textArray[len].x + sinX * sinXRatio) * spacing;
      yAnim = (yInit + textArray[len].y + sinY * sinYRatio) * spacing;
      sketch.beginShape();

      sketch.vertex(textArray[len].x, textArray[len].y);
      sketch.vertex(xAnim, yAnim);
      sketch.endShape(sketch.CLOSE);
    }
  }

  // SHOW/HIDE VISUAL ELEMENTS
  function showFPS() {
    sketch.push();
    sketch.textFont(font);
    sketch.noStroke();
    let fps = Math.floor(sketch.frameRate());
    sketch.colorMode(sketch.RGB);
    sketch.fill(255, 255, 255);
    sketch.textSize(20);
    sketch.text("FPS: " + fps, sketch.width - 72, 32);
    sketch.pop();
  }

  function showBoundingBox() {
    sketch.push();
    sketch.noFill();
    sketch.stroke(255);
    sketch.rect(textBoundary.x, textBoundary.y, textBoundary.w, textBoundary.h);
    sketch.ellipse(
      textBoundary.x + textBoundary.w / 2,
      textBoundary.y + textBoundary.h / 2,
      10,
      10
    );
    sketch.pop();
  }

  function drawCrossHair() {
    sketch.push();
    sketch.noFill();
    sketch.stroke(255);
    sketch.strokeWeight(3);
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.line(-10, 0, 10, 0);
    sketch.line(0, -10, 0, 10);

    sketch.pop();
  }
  function showFillText() {
    sketch.push();
    sketch.textFont(font);
    sketch.strokeWeight(strokeWeight);
    fillTextStroke ? sketch.stroke(fillColor) : sketch.noStroke();

    sketch.fill(fillColor);
    sketch.text(innerText, textX, textY);
    sketch.pop();
  }

  // DRAW FUNCTIONS
  function updateValues() {
    strokeWeight = strokeWeightSlider.value();
    fontSize = textSizeSlider.value();
    sketch.textSize(fontSize);
    sinXRatio = sinXSlider.value();
    sinYRatio = sinYSlider.value();
    xInit = xInitSlider.value();
    yInit = yInitSlider.value();
    posX += speedXSlider.value();
    posY += speedYSlider.value();
    posX == 360 ? (posX = 0) : null;
    posY == 360 ? (posY = 0) : null;
    bgColor = bgColourPicker.value();
    lineColor = colorPicker.color();
    spacing = spacingSlider.value();
    fillColor = textColorPicker.color();
  }

  function runRainbowMode() {
    let hue = (sketch.millis() / 100) % 100;
    sketch.colorMode(sketch.HSB, 100);
    let rainbowFill = sketch.color(hue, 100, 100);
    let rainbowLine = sketch.color(hue, 100, 50);
    fillColor = rainbowFill;
    lineColor = rainbowLine;
  }

  // p5 functions
  sketch.preload = () => {
    setupControls();
    font = sketch.loadFont(otfFile);
  };

  sketch.setup = () => {
    sketch.createCanvas(w, h);
    textX = sketch.width / 2;
    textY = sketch.height / 2;
    // wait for vars to initialize
    setTimeout(textSetup, 50);
    updateValues();
  };

  sketch.draw = () => {
    updateValues();
    sketch.background(bgColor);
    showFps ? showFPS() : null;
    showBoundary || dragging ? showBoundingBox() : null;
    sketch.noStroke();
    !rainbowMode ? sketch.stroke(lineColor) : runRainbowMode();
    makeVertexAnimation();
    fillText && textBoundary ? showFillText() : null;
    showCrosshair ? drawCrossHair() : null;
  };
};
