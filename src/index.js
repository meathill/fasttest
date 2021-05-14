import './styl/screen.styl';
import cases from './data/case';

/* global axios */

const startButton = document.getElementById('go-button');
const restartButton = document.getElementById('restart-button');
const startSection = document.getElementById('start-section');
const clock = document.getElementById('clock');
const clockBg = document.getElementById('clock-color');
const number = document.getElementById('speed-number');
const result = document.getElementById('result');
const progress = document.getElementById('progress');

startButton.addEventListener('click', doStart);
restartButton.addEventListener('click', doRestart);

clock.addEventListener('animationend', event => {
  clock.classList.remove('animated', 'zoomIn', 'zoomOut');
});

async function doStart() {
  startSection.classList.add('animated', 'zoomOut');
  await sleep(500);
  startSection.classList.add('hide');
  startSection.classList.remove('animated', 'zoomOut');
  await doTest();
}
async function doRestart() {
  result.classList.add('animated', 'zoomOut');
  await sleep(500);
  result.hidden = true;
  result.classList.remove('animated', 'zoomOut');
  await doTest();
}
async function doTest() {
  clock.hidden = false;
  clock.classList.add('animated', 'zoomIn');

  let score = 100;
  for (let i = 0, len = cases.length; i < len; i++) {
    const testCase = cases[i];
    progress.innerText = `${i + 1}/${len}`;
    try {
      let startTime = Date.now();
      let loaded = 0;
      await axios.get(testCase.link + '?ts=' + Date.now, {
        onDownloadProgress(event) {
          const now = Date.now();
          const time = now - startTime;
          const speed = (event.loaded - loaded) / time * 1000 / 1024 / 1024;
          showSpeed(speed);
        },
      });
    } catch (e) {
      score -= 100 / len;
    }
  }

  clock.classList.add('animated', 'zoomOut');
  await sleep(500);
  clock.hidden = true;
  result.hidden = false;
  result.classList.add('animated', 'zoomIn');
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
