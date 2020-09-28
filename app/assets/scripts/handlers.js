let rainbowMode = false;

export function handleCheck() {
  fillText = this.checked();
}

export function handleFile(file) {
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

export function handleRainbow() {
  rainbowMode = this.checked();
}
export function handleBoundary() {
  showBoundary = this.checked();
}

export function handleFPS() {
  showFps = this.checked();
}

export function handleInput() {
  innerText = this.value();
  changeText();
}
