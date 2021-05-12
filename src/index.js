import './styl/screen.styl';
import cases from './data/case';

const startButton = document.getElementById('go-button');
const startSection = document.getElementById('start-section');
const clock = document.getElementById('clock');
const clockBg = document.getElementById('clock-color');
const number = document.getElementById('speed-number');
const result = document.getElementById('result');

startButton.addEventListener('click', doStart);

async function doStart() {
  startSection.classList.add('animated', 'zoomOut');
  await sleep(500);
  startSection.hidden = true;
  startSection.classList.remove('animated', 'zoomOut');
  clock.hidden = false;

  let score = 100;
  for (const testCase of cases) {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        script.src = testCase.link;
        document.head.appendChild(script);
      });
    } catch (e) {
      score -= 100 / cases.length;
    }
  }

  clock.hidden = true;
  result.hidden = false;
}
function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}
function showSpeed(speed) {
  if (speed > 100) {
    speed = 100;
  } else if (speed < 0) {
    speed = 0;
  }
  number.innerText = speed;
  clock.style.setProperty('--speed', speed);
  const svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="354" width="354" viewBox="0 0 20 20" transform="rotate(135)"><circle r="5" cx="10" cy="10" fill="transparent" stroke="tomato" stroke-width="10" stroke-dasharray="calc(${speed} / 100 * 75 * 31.4 / 100) 31.4"></circle></svg>`;
  const blob = new Blob([svg], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  clockBg.style['-webkit-mask-image'] = 'url(' + url + ')';
}

window.showSpeed = showSpeed;
