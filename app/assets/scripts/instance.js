import otfFile from "./font.otf";
import throttle from "lodash/throttle";
import opentype from "opentype.js";
import p5 from "p5";
export default (sketch) => {
  let font,
    sinXSlider,
    sinYSlider,
    textSizeSlider,
    speedXSlider,
    speedYSlider,
    xInitSlider,
    yInitSlider,
    simplifySlider,
    spacingSlider,
    sampleFactorSlider,
    textColorPicker,
    bgColourPicker,
    fillCheckbox,
    rainbow,
    colorPicker,
    fpsCheckbox,
    savePresetButton,
    loadPresetButton,
    centerButton,
    sinX,
    sinY,
    rainbowFill,
    lineColor,
    bgColor,
    boundCheckbox,
    fillColor,
    xAnim,
    yAnim;

  let fontSize = 300;
  let textArray = [];
  let w = window.innerWidth;
  let h = window.innerHeight;
  let x = 0;
  let y = 0;
  let posX = 0.01;
  let posY = 0;
  let innerText = "HEAT";
  let sinXRatio = 53.3;
  let sinYRatio = 0;
  let spacing = 0.95;
  let xInit = 0;
  let yInit = 0;
  let fontInput;
  let simplify = 1;
  let fillText = true;
  let rainbowMode = false;
  let textInput;
  let changeButton;
  let textX = w / 2;
  let textY = h / 2;
  let lastX = 0;
  let textBoundary;
  let arraySampleFactor = 1;
  let showFps = true;
  let showBoundary = false;

  let presets = [];

  sketch.mouseDragged = () => {
    const { mouseX, mouseY } = sketch;
    if (mouseX > 200 && mouseX < w && mouseY > 0 && mouseY < h) {
      textX = mouseX;
      textY = mouseY;
      setTimeout(textSetup(), 500);
    }
  };

  function handleCheck() {
    fillText = this.checked();
  }

  function handleFile(file) {
    console.log(font);

    const p5Font = new p5.Font();
    console.log(p5Font);
    opentype.load(file.data, function (err, newFont) {
      if (err) {
        alert("Could not load font: " + err);
      } else {
        font = sketch.loadFont(file.data);
        // Use your font here.
      }
    });

    changeText();
  }

  function handleRainbow() {
    rainbowMode = this.checked();
  }
  function handleBoundary() {
    showBoundary = this.checked();
  }

  function handleFPS() {
    showFps = this.checked();
  }

  function handleInput() {
    innerText = this.value();
    changeText();
  }

  function logTextPos() {
    if (lastX !== textX) {
      console.log(`textX: ${textX}, textY:${textY}`);
      lastX = textX;
    }
  }

  function textSetup() {
    sketch.textStyle(sketch.BOLD);

    sketch.textSize(fontSize);
    sketch.fill(255);
    textBoundary = font.textBounds(innerText, textX, textY, fontSize);
    textX = textX - textBoundary.w / 2;
    textY = textY;

    textBoundary = font.textBounds(innerText, textX, textY, fontSize);
    textBoundary.w += 19;
    textArray = font.textToPoints(innerText, textX, textY, fontSize, {
      sampleFactor: sampleFactorSlider.value(),
      simplifyThreshold: 0,
    });
  }

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

  function changeText() {
    textBoundary = font.textBounds(innerText, textX, textY, fontSize);

    textArray = font.textToPoints(innerText, textX, textY, fontSize, {
      sampleFactor: sampleFactorSlider.value(),
      simplifyThreshold: 0,
    });
  }

  function addClasses() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(function (input) {
      input.classList.add(".p5input");
      document.querySelector(".controlpanel").appendChild(input);
    });
    const labels = document.querySelectorAll("label");
    labels.forEach(function (label) {
      label.classList.add(".p5label");
      document.querySelector(".controlpanel").appendChild(label);
    });
  }

  function updateLabels(labels) {
    labels.forEach(function (label) {
      let elementLabel = document.createElement("label");
      label.element.name = label.label;
      const id = label.element.name;
      label.element.elt.id = id;

      //elementLabel.innerText = label.label + ": " + label.element.value();
      elementLabel.innerText = label.label;

      elementLabel.setAttribute("for", id);
      document.querySelector(".controlpanel").appendChild(elementLabel);
      label.element.parent(sketch.select(".controlpanel"));
    });
  }
  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    w = sketch.windowWidth;
    h = sketch.windowHeight;
    textX = w / 2;
    textY = h / 2;
    textSetup();
  };
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

  function setupControls() {
    const controlPanel = sketch.select(".controlpanel");
    textSizeSlider = sketch.createSlider(12, 512, fontSize, 12);
    textSizeSlider.changed(changeText);
    speedXSlider = sketch.createSlider(0, 0.5, posX, 0.01);
    speedYSlider = sketch.createSlider(0, 0.5, posY, 0.01);
    sinXSlider = sketch.createSlider(0, w, sinXRatio, 0.1);
    sinYSlider = sketch.createSlider(0, h, sinYRatio, 0.1);
    xInitSlider = sketch.createSlider(-w, w, xInit, 0.1);
    yInitSlider = sketch.createSlider(-h, h, yInit, 0.1);
    simplifySlider = sketch.createSlider(-1, 2, simplify, 0.1);
    spacingSlider = sketch.createSlider(0, 2, spacing, 0.05);
    sampleFactorSlider = sketch.createSlider(0.01, 1.5, arraySampleFactor, 0.1);
    sampleFactorSlider.changed(changeText);
    colorPicker = sketch.createColorPicker("#ff0048");
    textColorPicker = sketch.createColorPicker("#fff");
    bgColourPicker = sketch.createColorPicker("#1f1f1f");
    fillCheckbox = sketch.createCheckbox("Fill Text", false);
    rainbow = sketch.createCheckbox("Rainbow Mode", false);
    rainbow.changed(handleRainbow);
    rainbow.parent(controlPanel);
    fillCheckbox.changed(handleCheck);
    fillCheckbox.parent(controlPanel);

    fpsCheckbox = sketch.createCheckbox("Show FPS", false);
    fpsCheckbox.changed(handleFPS);
    fpsCheckbox.parent(controlPanel);

    boundCheckbox = sketch.createCheckbox("Show Bounding Box", false);
    boundCheckbox.changed(handleBoundary);
    fontInput = sketch.createFileInput(handleFile);
    fontInput.parent(controlPanel);
    textInput = sketch.createInput(innerText);
    textInput.input(handleInput);
    textInput.parent(controlPanel);

    changeButton = sketch.createButton("change text");
    changeButton.mousePressed(changeText);
    changeButton.parent(controlPanel);

    centerButton = sketch.createButton("center text");
    centerButton.mousePressed(() => {
      textX = w / 2;
      textY = h / 2;
      textSetup();
    });
    centerButton.parent(controlPanel);

    savePresetButton = sketch.createButton("save preset");
    savePresetButton.mousePressed(() => savePreset());
    savePresetButton.parent(controlPanel);

    loadPresetButton = sketch.createButton("load preset");
    loadPresetButton.mousePressed(() => loadPreset());
    loadPresetButton.parent(controlPanel);

    const labels = [
      {
        label: "Speed X",
        element: speedXSlider,
      },
      {
        label: "Speed Y",
        element: speedYSlider,
      },
      {
        label: "Sine Range X",
        element: sinXSlider,
      },
      {
        label: "Sine Range Y",
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
        label: "Simplify",
        element: simplifySlider,
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
        element: fpsCheckbox,
      },
      {
        label: "",
        element: boundCheckbox,
      },
    ];

    updateLabels(labels);
  }
  let lastval = 0;

  function logifChanged(val) {
    if (val !== lastval) {
      console.log(val);
      lasval = val;
    }
  }

  function makeLineAnimation() {
    for (let i = 0; i < textArray.length; i++) {
      let x = textArray[i].x;
      let y = textArray[i].y;
      sinX = sketch.sin(posX);
      sinX == 0 ? console.log(sinX) : null;
      sinY = sketch.sin(posY);
      xAnim = (xInit + x + sinX * sinXRatio) * spacing;
      yAnim = (yInit + y + sinY * sinYRatio) * spacing;
      sketch.push();
      sketch.line(x, y, xAnim, yAnim);
      sketch.pop();
    }
  }

  function makeVertexAnimation() {
    textArray.forEach(function (val) {
      let x = val.x;
      let y = val.y;
      sinX = sketch.sin(posX);
      sinX == 0 ? console.log(sinX) : null;
      sinY = sketch.sin(posY);

      xAnim = (xInit + x + sinX * sinXRatio) * spacing;
      yAnim = (yInit + y + sinY * sinYRatio) * spacing;
      sketch.beginShape();
      sketch.fill(255);
      sketch.vertex(x, y);
      sketch.vertex(xAnim, yAnim);

      sketch.endShape(sketch.CLOSE);
    });
  }

  function showFPS() {
    sketch.push();
    sketch.textFont(font);
    sketch.noStroke();
    let fps = Math.floor(sketch.frameRate());
    sketch.colorMode(sketch.RGB);
    sketch.fill(255, 255, 255);
    sketch.textSize(20);
    sketch.text("FPS: " + fps, w - 80, 20);
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
  function showFillText() {
    sketch.push();
    sketch.textFont(font);
    sketch.noStroke();

    sketch.fill(!rainbowMode ? fillColor : rainbowFill);
    sketch.text(innerText, textX, textY);
    sketch.pop();
  }
  sketch.preload = () => {
    //   load in the font
    setupControls();
    font = sketch.loadFont(otfFile);
  };

  sketch.setup = () => {
    sketch.createCanvas(w - 150, h);
    textX = w / 2;
    textY = h / 2;
    textSetup();

    setTimeout(savePreset, 100);
  };

  sketch.draw = () => {
    //sketch.frameCount % 20 == 0 ? logTextPos() : null;
    //frameCount % 20 == 0  ? console.log(sinX) : null;

    simplify = simplifySlider.value();
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

    sketch.background(bgColor);
    showFps ? showFPS() : null;
    showBoundary ? showBoundingBox() : null;
    sketch.noStroke();

    if (rainbowMode) {
      let hue = sketch.frameCount % 100;
      sketch.colorMode(sketch.HSB, 100);
      let rainbowFill = sketch.color(hue, 100, 100);
      sketch.fill(rainbowFill);
      sketch.stroke(sketch.color(hue, 50, 100));
    }

    !rainbowMode ? sketch.stroke(lineColor) : null;

    //makeLineAnimation();

    makeVertexAnimation();
    fillText ? showFillText() : null;
  };
};
