import p5 from "p5"
import { background950, primary50, } from "../../consts/colors"


const container = document.querySelector("#p5-container") as HTMLDivElement

const powInterpolate = (start: number, end: number, amt: number, factor = 1) => {
  const amt2 = Math.max(0, Math.min(1, amt))
  return start + (end - start) * Math.pow(amt2, factor)
}

function interpolateWithGaussian(min: number, max: number, amount: number, spread = 1): number {
  // Calculate the mean and deviation
  const deviation = (max - min) / (max * spread); // Adjust this value for desired spread

  // Calculate the interpolated value using a Gaussian distribution function
  return min + (max - min) * gaussian(amount, 0, deviation);
}

function gaussian(x: number, mean: number, deviation: number): number {
  // return x
  return 2 * Math.exp(-(Math.pow(x - mean, 2) / (2 * Math.pow(deviation, 2))));
}

const norm = (x: number, a = 1, b = 1, c = 1) => {
  return a * Math.exp(-((x - b) ** 2) / 2 * c ** 2)
}

const normInterpolate = (start: number, end: number, amt: number, a = 1, b = 1, c = 1) => {
  const amt2 = (1 - Math.cos(amt * Math.PI)) / 2;
  return (start * (1 - amt2) + end * amt2);

}

const cosineInterpolate = (start: number, end: number, amt: number) => {
  const amt2 = (1 - Math.cos(amt * Math.PI)) / 2;
  return (start * (1 - amt2) + end * amt2);
}

export const sketch = (p: p5) => {
  if (!container) return

  let steps = 1;

  const rh = 20

  const accent = primary50

  const bg = p.color(...background950)

  let counter = 0
  const STEP = 5
  let direction = STEP

  p.setup = () => {
    p.createCanvas(container.clientWidth, container.clientHeight)
    p.colorMode(p.HSL)
    p.frameRate(30)
    steps = Math.round(p.height / rh)
    direction = STEP
  }

  p.draw = () => {
    const circCenter = { x: p.width / 2, y: p.height / 2 }
    steps = Math.round(p.height / rh)
    if (counter > p.width) {
      direction = -STEP
    }
    if (counter < 0) {
      direction = STEP
    }
    counter = counter + direction;

    p.noStroke()
    p.background(bg)

    for (const i of Array.from(Array(steps)).keys()) {
      for (const j of Array.from(Array(p.width)).keys()) {
        const distFactor = Math.sqrt((j - circCenter.x) ** 2 + (i * rh - circCenter.y) ** 2) / p.width
        let lightness = 0;
        if (i % 2 === 0) {
          lightness = cosineInterpolate(0, 20, (p.width - counter) / p.width * 3);
        }
        else {
          lightness = powInterpolate(60, 0, distFactor * 5 - counter / p.width, 1) + cosineInterpolate(0, 10, (counter - j) / p.width);
        }
        p.fill(p.color(accent[0], accent[1], lightness))
        p.rect(j, i * rh, 1, rh)
      }
    }

  }
}

