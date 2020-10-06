import otfFile from '../fonts/font.otf'
import opentype from 'opentype.js'
import config from './config'
import { Font } from 'p5'

export default (sketch) => {
  let {
    font,
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
    fontInput,
    textInput,
    textX,
    textY,
    fontSize,
    posX,
    posY,
    w,
    h,
    sinXRatio,
    sinYRatio,
    xInit,
    yInit,
    strokeWeight,
    spacing,
    arraySampleFactor,
    rainbowMode,
    fillText,
    showFps,
    showCrosshair,
    fillTextStroke,
    showBoundary,
    innerText,
    isMobile,
    textBoundary,
    dragging,
    textArray,
    rawArray,
    errText,
    fontBasename,
    presets
  } = config

  // EVENT LISTENERS
  let ctx
  sketch.mouseDragged = (e) => {
    const { mouseX, mouseY } = sketch
    if (e.srcElement.className === 'p5Canvas') {
      if (mouseX > 200 && mouseX < w && mouseY > 0 && mouseY < h) {
        dragging = true
        textX = mouseX
        textY = mouseY
        setTimeout(textSetup(), 20)
      }
    }
  }
  sketch.mouseReleased = () => {
    dragging = false
  }
  sketch.windowResized = () => {
    setTimeout(() => {
      sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight)
      w = sketch.width
      h = sketch.height
      textX = w / 2
      textY = h / 2
      textSetup()
    }, 100)
  }

  const handleFile = async (file) => {
    const fallBack = font
    try {
      fontBasename = file.name.split('.')[0]

      const newFont = await opentype.load(file.data)
      newFont.defaultRenderOptions.kerning = false
      const p5Font = new Font(sketch)
      p5Font.font = newFont
      font = p5Font
      centerText()
      changeText()
    } catch (error) {
      errText = 'Unsupported Font!'
      setTimeout(() => {
        errText = ''
      }, 1000)
      font = fallBack
    }
  }

  const saveImages = (num = 1) => {
    sketch.noLoop()
    for (let i = 0; i < num; i++) {
      sketch.save(`textbench_${innerText}_frame_${sketch.frameCount}.jpg`)
    }
    sketch.loop()
  }

  const showError = (errText) => {
    sketch.push()
    sketch.fill(255)
    sketch.noStroke()
    sketch.textSize(16)
    sketch.text(errText, sketch.width / 2, 100)
    sketch.pop()
    console.log(errText)
  }

  const handleInput = (e) => {
    innerText = e.target.value
    changeText()
  }

  // TEXT SETUP
  const textSetup = () => {
    textBoundary = font.textBounds(innerText, textX, textY, fontSize)
    textX -= textBoundary.w / 2
    textY += textBoundary.h / 2
    // reinit textboundary after centering text
    textBoundary = font.textBounds(innerText, textX, textY, fontSize)
    rawArray = font.textToPoints(innerText, textX, textY, fontSize, {
      sampleFactor: sampleFactorSlider.value(),
      simplifyThreshold: 0
    })
    textArray = rawArray.map((vec) => {
      return {
        x: Math.floor(vec.x),
        y: Math.floor(vec.y)
      }
    })
  }

  const changeText = () => {
    textBoundary = font.textBounds(innerText, textX, textY, fontSize)
    rawArray = font.textToPoints(innerText, textX, textY, fontSize, {
      sampleFactor: sampleFactorSlider.value(),
      simplifyThreshold: 0
    })
    textArray = rawArray.map((vec) => {
      return {
        x: Math.floor(vec.x),
        y: Math.floor(vec.y)
      }
    })
  }

  // PRESETS

  const savePreset = () => {
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
      fillText
    })
  }

  const loadPreset = () => {
    // get last state
    let p = presets[presets.length - 1]
    textArray = p.presetArray
    textSizeSlider.value(p.fontSize)
    speedXSlider.value(p.speedX)
    speedYSlider.value(p.speedY)
    sinXSlider.value(p.sinXRatio)
    sinYSlider.value(p.sinYRatio)
    xInitSlider.value(p.xInit)
    yInitSlider.value(p.yInit)
    spacingSlider.value(p.spacing)
    sampleFactorSlider.value(p.arraySampleFactor)
    colorPicker.value(p.lineColor)
    textColorPicker.value(p.fillColor)
    bgColourPicker.value(p.bgColor)
    fillCheckbox.checked(p.fillText)
    textInput.value(p.storedText)
    fillText = p.fillText
    textX = p.storedX
    textY = p.storedY
    innerText = p.storedText
  }

  // MAKE LABELS FOR UI
  const updateLabels = (labels) => {
    labels.forEach(function (label) {
      let elementLabel = document.createElement('label')
      label.element.name = label.label
      const id = label.element.name
      const formgroup = document.createElement('div')
      formgroup.classList.add('formgroup')
      label.element.elt.id = id
      elementLabel.setAttribute('for', id)
      elementLabel.innerText = label.label
      if (isMobile) {
        // different css rules on mobile layout
        document.querySelector('.controlpanel').appendChild(formgroup)
        formgroup.appendChild(elementLabel)
        formgroup.appendChild(label.element.elt)
        fontInput.hide()
      } else {
        // add labels to elements
        document.querySelector('.controlpanel').appendChild(elementLabel)
        label.element.parent(sketch.select('.controlpanel'))
      }
    })
  }

  // SETUP UI
  const setupControls = () => {
    const controlPanel = sketch.select('.controlpanel')
    textSizeSlider = sketch.createSlider(12, 1024, fontSize, 12)
    textSizeSlider.changed(changeText)
    speedXSlider = sketch.createSlider(0, 0.5, posX, 0.01)
    speedYSlider = sketch.createSlider(0, 0.5, posY, 0.01)
    sinXSlider = sketch.createSlider(0, w, sinXRatio, 0.1)
    sinYSlider = sketch.createSlider(0, h, sinYRatio, 0.1)
    xInitSlider = sketch.createSlider(-w, w, xInit, 0.1)
    yInitSlider = sketch.createSlider(-h, h, yInit, 0.1)
    strokeWeightSlider = sketch.createSlider(1, 15, strokeWeight, 1)
    spacingSlider = sketch.createSlider(0, 2, spacing, 0.05)
    sampleFactorSlider = sketch.createSlider(0.01, 1.5, arraySampleFactor, 0.1)
    sampleFactorSlider.changed(changeText)
    colorPicker = sketch.createColorPicker('#ff0048')
    textColorPicker = sketch.createColorPicker('#fff')
    bgColourPicker = sketch.createColorPicker('#3f3f3f')
    rainbow = sketch.createCheckbox('Rainbow Mode', rainbowMode)
    rainbow.changed(() => (rainbowMode = !rainbowMode))
    rainbow.parent(controlPanel)
    fillCheckbox = sketch.createCheckbox('Fill Text', fillText)
    fillCheckbox.changed(() => (fillText = !fillText))
    fillCheckbox.parent(controlPanel)
    fpsCheckbox = sketch.createCheckbox('FPS', showFps)
    fpsCheckbox.changed(() => (showFps = !showFps))
    fpsCheckbox.parent(controlPanel)
    crosshairCheckbox = sketch.createCheckbox('Crosshair', showCrosshair)
    crosshairCheckbox.changed(() => (showCrosshair = !showCrosshair))
    crosshairCheckbox.parent(controlPanel)
    fillTextStrokeCheckbox = sketch.createCheckbox('Fill Text Stroke', fillTextStroke)
    fillTextStrokeCheckbox.changed(() => (fillTextStroke = !fillTextStroke))
    fillTextStrokeCheckbox.parent(controlPanel)
    boundCheckbox = sketch.createCheckbox('Bounding Box', showBoundary)
    boundCheckbox.changed(() => (showBoundary = !showBoundary))
    textInput = sketch.createInput(innerText)
    textInput.input((e) => handleInput(e))
    textInput.parent(controlPanel)
    fontInput = sketch.createFileInput((e) => handleFile(e))
    fontInput.parent(controlPanel)
    saveButton = sketch.createButton('Save Frame')
    saveButton.mousePressed(() => saveImages(1))
    saveButton.parent(controlPanel)
    centerButton = sketch.createButton('center text')
    centerButton.mousePressed(() => {
      centerText()
      textSetup()
    })
    centerButton.parent(controlPanel)
    savePresetButton = sketch.createButton('save state')
    savePresetButton.mousePressed(() => savePreset())
    savePresetButton.parent(controlPanel)
    loadPresetButton = sketch.createButton('load state')
    loadPresetButton.mousePressed(() => loadPreset())
    loadPresetButton.parent(controlPanel)

    let labels = [
      { label: 'Animation Speed X', element: speedXSlider },
      { label: 'Animation Speed Y', element: speedYSlider },
      { label: 'Animation Range X', element: sinXSlider },
      { label: 'Animation Range Y', element: sinYSlider },
      { label: 'X Init', element: xInitSlider },
      { label: 'Y Init', element: yInitSlider },
      { label: 'Spacing', element: spacingSlider },
      { label: 'Stroke Weight', element: strokeWeightSlider },
      { label: 'Sample Factor', element: sampleFactorSlider },
      { label: 'Text Size', element: textSizeSlider },
      { label: 'Line Colour', element: colorPicker },
      { label: 'Text Fill', element: textColorPicker },
      { label: 'Background Colour', element: bgColourPicker },
      { label: '', element: rainbow },
      { label: '', element: fillCheckbox },
      { label: '', element: fillTextStrokeCheckbox },
      { label: '', element: crosshairCheckbox },
      { label: '', element: fpsCheckbox },
      { label: '', element: boundCheckbox }
    ]
    !isMobile ? labels.push({ label: 'Upload OpenType Font ', element: fontInput }) : null
    updateLabels(labels)
  }
  const centerText = () => {
    textX = sketch.width / 2
    textY = sketch.height / 2
  }
  // MAKE ANIMATION FROM VERTICES
  const makeVertexAnimation = () => {
    sketch.push()
    sketch.stroke(lineColor)
    sketch.strokeWeight(strokeWeight)
    textArray.forEach((val) => {
      // val.x = Math.floor(val.x)
      // val.y = Math.floor(val.y)
      sinX = Math.sin(posX)
      sinY = Math.sin(posY)
      xAnim = (xInit + val.x + sinX * sinXRatio) * spacing
      yAnim = (yInit + val.y + sinY * sinYRatio) * spacing
      sketch.beginShape()
      sketch.vertex(val.x, val.y)
      sketch.vertex(xAnim.toFixed(2), yAnim.toFixed(2))
      sketch.endShape()
    })
    sketch.pop()
  }

  const makeAnimationNative = () => {
    ctx.lineWidth = strokeWeight
    ctx.strokeStyle = lineColor
    textArray.forEach((val) => {
      sinX = Math.sin(posX)
      sinY = Math.sin(posY)
      xAnim = (xInit + val.x + sinX * sinXRatio) * spacing
      yAnim = (yInit + val.y + sinY * sinYRatio) * spacing
      ctx.beginPath()
      ctx.moveTo(val.x, val.y)
      ctx.lineTo(xAnim, yAnim)
      ctx.stroke()
    })
    // sketch.pop()
  }

  // SHOW/HIDE VISUAL ELEMENTS
  const showFPS = () => {
    sketch.push()
    sketch.textFont(font)
    sketch.noStroke()
    let fps = Math.floor(sketch.frameRate())
    sketch.colorMode(sketch.RGB)
    sketch.fill(255, 255, 255)
    sketch.textSize(20)
    sketch.text('FPS: ' + fps, sketch.width - 72, 32)
    sketch.pop()
  }

  const showBoundingBox = () => {
    sketch.push()
    sketch.noFill()
    sketch.stroke(255)
    sketch.strokeWeight(1)
    sketch.translate(textBoundary.x, textBoundary.y)
    sketch.rect(0, 0, textBoundary.w, textBoundary.h)
    sketch.ellipse(0 + textBoundary.w / 2, 0 + textBoundary.h / 2, 10, 10)
    sketch.pop()
  }

  const drawCrossHair = () => {
    sketch.push()
    sketch.noFill()
    sketch.stroke(255)
    sketch.strokeWeight(3)
    sketch.translate(sketch.width / 2, sketch.height / 2)
    sketch.line(-10, 0, 10, 0)
    sketch.line(0, -10, 0, 10)
    sketch.pop()
  }

  const showFillText = () => {
    sketch.push()
    sketch.noStroke()
    sketch.textFont(font)
    sketch.textSize(fontSize)
    sketch.strokeWeight(strokeWeight)
    fillTextStroke ? sketch.stroke(fillColor) : sketch.noStroke()
    sketch.drawingContext.fillStyle = fillColor
    sketch.drawingContext.font = `${fontSize}px ${fontBasename} `
    sketch.fill(fillColor)
    sketch.text(innerText, Math.floor(textX), Math.floor(textY))
    sketch.pop()
  }
  const fillTextCanvas = () => {
    ctx.fillStyle = fillColor
    ctx.font = `800 ${fontSize}px ${fontBasename || 'font'} `
    ctx.fillText(innerText, textX, textY)
  }
  // DRAW FUNCTIONS
  const updateValues = () => {
    strokeWeight = strokeWeightSlider.value()
    fontSize = textSizeSlider.value()
    sinXRatio = sinXSlider.value()
    sinYRatio = sinYSlider.value()
    xInit = xInitSlider.value()
    yInit = yInitSlider.value()
    posX += speedXSlider.value()
    posY += speedYSlider.value()
    posX == 360 ? (posX = 0) : null
    posY == 360 ? (posY = 0) : null
    bgColor = bgColourPicker.value()
    lineColor = colorPicker.color()
    spacing = spacingSlider.value()
    fillColor = textColorPicker.color()
  }

  const timeFunction = (func) => {
    console.time(`${func.name}`)
    func()
    console.timeEnd(`${func.name}`)
  }

  const runRainbowMode = () => {
    let hue = (sketch.millis() / 100) % 100
    sketch.colorMode(sketch.HSB, 100)
    let rainbowFill = sketch.color(hue, 100, 100)
    let rainbowLine = sketch.color(hue, 100, 50)
    fillColor = rainbowFill
    lineColor = rainbowLine
  }

  // p5 functions
  sketch.preload = () => {
    setupControls()
    font = sketch.loadFont(otfFile)
  }

  sketch.setup = () => {
    sketch.createCanvas(w, h)
    ctx = sketch.drawingContext
    w = sketch.width
    h = sketch.height
    centerText()
    textSetup()
    updateValues()
    savePreset()
  }

  sketch.draw = () => {
    updateValues()
    sketch.background(bgColor)
    showFps && showFPS()
    showBoundary || dragging ? showBoundingBox() : null
    rainbowMode && runRainbowMode()

    makeAnimationNative()

    fillText && textArray && showFillText()
    showCrosshair && drawCrossHair()
    errText && showError(errText)
  }
}

// TODO
/*
function makeRotateAnimation() {
  var len = textArray.length
  while (len--) {
    let char = innerText[len % innerText.length]
    sketch.push()
    sketch.translate(textArray[len].x + xInit, textArray[len].y + yInit)
    sketch.noStroke()
    sketch.fill(lineColor)
    sketch.textSize(fontSize / 20)
    sketch.text(char, 0, 0)
    sketch.pop()
  }
}

function makeVertexWhileLoop() {
  var len = textArray.length
  while (len--) {
    sinX = Math.sin(posX)
    sinY = Math.sin(posY)
    xAnim = (xInit + textArray[len].x + sinX * sinXRatio) * spacing
    yAnim = (yInit + textArray[len].y + sinY * sinYRatio) * spacing
    sketch.beginShape()
    sketch.vertex(textArray[len].x, textArray[len].y)
    sketch.vertex(xAnim, yAnim)
    sketch.endShape(sketch.CLOSE)
  }
}


const drawOpenTypePath = () => {
  const path = font.font.getPath(innerText, textX, textY, fontSize)
  font.font.draw(sketch.drawingContext, innerText, textX, textY, fontSize)
  path.fill = fillColor
  path.draw(sketch.drawingContext)
  font.font.drawMetrics(sketch.drawingContext, innerText, textX, textY, fontSize)
}


 */
