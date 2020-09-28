let font;
let fontSize = 300;
let textArray = [];
let w = window.innerWidth;
let h = window.innerHeight;
let x = 0;
let y = 0;
let posX = 0.06;
let posY = 0.06;
let innerText = "HEAT";
let sinXRatio = 0;
let sinYRatio = 0;
let spacing = 1;
let xInit = 0;
let yInit = 0;
let sinXSlider;
let sinYSlider;
let speedSlider;
let colorPicker;
let grow = 1;
let fillText = false;
let rainbowMode = false;
let textInput;
let changeButton;
let textX = w / 2;
let textY = h / 2;
let lastX = 0;
let textBoundary;
let textCenterX, textCenterY;
let arraySampleFactor = 1;
let showFps = false;
let showBoundary = false;
let sinX, sinY;
let lineColor;
let bgColor;
let boundCheckbox;
let fillColor;
let rainbowFill;
let presets = [];

function mouseDragged() {
  if (mouseX > 200 && mouseX < w && mouseY > 0 && mouseY < height) {
    textX = mouseX;
    textY = mouseY;
    setTimeout(textSetup(), 100);
  }
}

function handleCheck() {
  fillText = this.checked();
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
  textFont(font);
  textStyle(BOLD);

  textSize(fontSize);
  fill(255);
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
  console.log(presets);
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
    label.element.parent(select(".controlpanel"));
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

function setupControls() {
  const controlPanel = select(".controlpanel");
  textSizeSlider = createSlider(12, 512, fontSize, 12);
  textSizeSlider.changed(changeText);
  speedXSlider = createSlider(0, 0.5, posX, 0.01);
  speedYSlider = createSlider(0, 0.5, posY, 0.01);
  sinXSlider = createSlider(0, w, sinXRatio, 0.1);
  sinYSlider = createSlider(0, h, sinYRatio, 0.1);
  xInitSlider = createSlider(-w, w, xInit, 0.1);
  yInitSlider = createSlider(-h, h, yInit, 0.1);
  growSlider = createSlider(-1, 2, grow, 0.1);
  spacingSlider = createSlider(0, 2, spacing, 0.05);
  sampleFactorSlider = createSlider(0.01, 1.5, arraySampleFactor, 0.1);
  sampleFactorSlider.changed(changeText);
  colorPicker = createColorPicker("#ff0048");
  textColorPicker = createColorPicker("#fff");
  bgColourPicker = createColorPicker("#1f1f1f");
  fillCheckbox = createCheckbox("Fill Text", false);
  rainbow = createCheckbox("Rainbow Mode", false);
  rainbow.changed(handleRainbow);
  rainbow.parent(controlPanel);
  fillCheckbox.changed(handleCheck);
  fillCheckbox.parent(controlPanel);

  fpsCheckbox = createCheckbox("Show FPS", false);
  fpsCheckbox.changed(handleFPS);
  fpsCheckbox.parent(controlPanel);

  boundCheckbox = createCheckbox("Show Bounding Box", false);
  boundCheckbox.changed(handleBoundary);

  textInput = createInput("");
  textInput.input(handleInput);
  textInput.parent(controlPanel);

  changeButton = createButton("change text");
  changeButton.mousePressed(changeText);
  changeButton.parent(controlPanel);

  centerButton = createButton("center text");
  centerButton.mousePressed(() => {
    textX = w / 2;
    textY = h / 2;
    textSetup();
  });
  centerButton.parent(controlPanel);

  savePresetButton = createButton("save preset");
  savePresetButton.mousePressed(() => savePreset());
  savePresetButton.parent(controlPanel);

  loadPresetButton = createButton("load preset");
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
      label: "Grow",
      element: growSlider,
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
    sinX = sin(posX);
    sinX == 0 ? console.log(sinX) : null;
    sinY = sin(posY);

    xAnim = (xInit + x + sinX * sinXRatio) * spacing;
    yAnim = (yInit + y + sinY * sinYRatio) * spacing;

    push();
    line(x, y, xAnim, yAnim);
    pop();
  }
}

function makeVertexAnimation() {
  textArray.forEach(function (val) {
    let x = val.x;
    let y = val.y;
    sinX = sin(posX);
    sinX == 0 ? console.log(sinX) : null;
    sinY = sin(posY);

    xAnim = (xInit + x + sinX * sinXRatio) * spacing;
    yAnim = (yInit + y + sinY * sinYRatio) * spacing;
    beginShape();
    fill(255);
    vertex(x, y);
    vertex(xAnim, yAnim);

    endShape(CLOSE);
  });
}

function showFPS() {
  push();
  textFont(font);
  noStroke();
  let fps = Math.floor(frameRate());
  colorMode(RGB);
  fill(255, 255, 255);
  textSize(20);
  text("FPS: " + fps, width - 80, 20);
  pop();
}

function showBoundingBox() {
  push();
  noFill();
  stroke(255);
  rect(textBoundary.x, textBoundary.y, textBoundary.w, textBoundary.h);
  ellipse(
    textBoundary.x + textBoundary.w / 2,
    textBoundary.y + textBoundary.h / 2,
    10,
    10
  );
  pop();
}

function preload() {
  //   load in the font
  setupControls();
  font = loadFont(
    "https://github.com/google/fonts/blob/master/ofl/akronim/Akronim-Regular.ttf?raw=true"
  );
}

function setup() {
  createCanvas(w, h);
  textX = w / 2;
  textY = h / 2;
  textSetup();

  setTimeout(savePreset, 100);
}

function draw() {
  frameCount % 20 == 0 ? logTextPos() : null;
  //frameCount % 20 == 0  ? console.log(sinX) : null;

  grow = growSlider.value();
  fontSize = textSizeSlider.value();
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

  background(bgColor);
  showFps ? showFPS() : null;
  showBoundary ? showBoundingBox() : null;
  noStroke();

  fill(fillColor);

  if (rainbowMode) {
    let hue = frameCount % 100;
    let rainbowFill = color(hue, 100, 100);
    fill(rainbowFill);
    stroke(color(hue, 50, 100));
    colorMode(HSB, 100);
  }

  !rainbowMode ? stroke(lineColor) : null;

  //makeLineAnimation();

  makeVertexAnimation();
  push();
  fill(fillColor);
  textSize(fontSize);
  fillText ? text(innerText, textX, textY) : null;
  pop();
}
