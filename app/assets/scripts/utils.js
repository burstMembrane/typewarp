export function logTextPos() {
  if (lastX !== textX) {
    console.log(`textX: ${textX}, textY:${textY}`);
    lastX = textX;
  }
}
export function setupControls() {
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
