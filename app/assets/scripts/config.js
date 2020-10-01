let config = {
  font: null,
  sampleFactorSlider: null,
  saveButton: null,
  speedXSlider: null,
  speedYSlider: null,
  colorPicker: null,
  textColorPicker: null,
  bgColor: null,
  textSizeSlider: null,
  sinXSlider: null,
  sinYSlider: null,
  xInitSlider: null,
  yInitSlider: null,
  spacingSlider: null,
  bgColourPicker: null,
  fillCheckbox: null,
  strokeWeightSlider: null,
  rainbow: null,
  fpsCheckbox: null,
  boundCheckbox: null,
  crosshairCheckbox: null,
  centerButton: null,
  savePresetButton: null,
  loadPresetButton: null,
  fillTextStrokeCheckbox: null,
  sinX: null,
  sinY: null,
  xAnim: null,
  yAnim: null,
  fillColor: null,
  lineColor: null,
  fontInput: null,
  textBoundary: null,
  fontBasename: 'font',
  errText: '',
  strokeWeight: 4,
  showCrosshair: false,
  textArray: [],
  fillArray: [],
  posX: 0.01,
  posY: 0,
  innerText: 'HEAT',
  sinXRatio: 53.3,
  sinYRatio: 0,
  spacing: 0.95,
  xInit: 0,
  yInit: 0,
  fillText: true,
  rainbowMode: false,
  arraySampleFactor: 0.3,
  showFps: false,
  showBoundary: false,
  dragging: false,
  fillTextStroke: false,
  presets: []
}
config.controlPanel = document.querySelector('.controlpanel')
config.controlpanelHeight = config.controlPanel.clientHeight
config.w = window.innerWidth
config.isMobile = config.w < 600
config.h = window.innerHeight - (config.isMobile ? config.controlpanelHeight : 0)
config.fontSize = config.isMobile ? config.w / 2.8 : config.w / 4

config.labels = [
  {
    label: 'Animation Speed X',
    element: config.speedXSlider
  },
  {
    label: 'Animation Speed Y',
    element: config.speedYSlider
  },
  {
    label: 'Animation Range X',
    element: config.sinXSlider
  },
  {
    label: 'Animation Range Y',
    element: config.sinYSlider
  },
  {
    label: 'X Init',
    element: config.xInitSlider
  },
  {
    label: 'Y Init',
    element: config.yInitSlider
  },
  {
    label: 'Spacing',
    element: config.spacingSlider
  },
  {
    label: 'Stroke Weight',
    element: config.strokeWeightSlider
  },
  {
    label: 'Sample Factor',
    element: config.sampleFactorSlider
  },
  {
    label: 'Text Size',
    element: config.textSizeSlider
  },
  {
    label: 'Line Colour',
    element: config.colorPicker
  },
  {
    label: 'Text Fill',
    element: config.textColorPicker
  },
  {
    label: 'Background Colour',
    element: config.bgColourPicker
  },
  {
    label: '',
    element: config.rainbow
  },
  {
    label: '',
    element: config.fillCheckbox
  },
  {
    label: '',
    element: config.fillTextStrokeCheckbox
  },
  {
    label: '',
    element: config.crosshairCheckbox
  },
  {
    label: '',
    element: config.fpsCheckbox
  },
  {
    label: '',
    element: config.boundCheckbox
  }
]

export default config
