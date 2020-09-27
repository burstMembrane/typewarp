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

export default handleRainbow = () => {
  rainbowMode = this.checked();
};

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
