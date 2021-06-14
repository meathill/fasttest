import './styl/screen.styl';
import cases from './data/case';

/* global axios, devMode */

const startButton = document.getElementById('go-button');
const restartButton = document.getElementById('restart-button');
const startSection = document.getElementById('start-section');
const clock = document.getElementById('clock');
const clockBg = document.getElementById('clock-color');
const number = document.getElementById('speed-number');
const result = document.getElementById('result');
const progress = document.getElementById('progress');
const startTitle = document.getElementById('start-title');
const resultTitle = document.getElementById('result-title');

const MAX_SCORE_SPEED = 50; // 50Mbps = 100

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
  const stars = document.getElementsByClassName('light');
  while (stars.length) {
    stars[0].classList.remove('light');
  }
  const errors = document.getElementsByClassName('error');
  while (errors.length) {
    errors[0].classList.remove('error');
  }
  result.style.removeProperty('--number');
  clock.style.removeProperty('--speed');
  clockBg.style['-webkit-mask-image'] = '';

  result.classList.add('animated', 'zoomOut');
  await sleep(500);
  startTitle.hidden = false;
  resultTitle.hidden = true;
  result.hidden = true;
  result.classList.remove('animated', 'zoomOut');
  await doTest();
}
async function doTest() {
  clock.hidden = false;
  clock.classList.add('animated', 'zoomIn');
  await sleep(800);

  let score = 0;
  const oneScore = Math.round(100 / cases.length * 100) / 100;
  let speed;
  for (let i = 0, len = cases.length; i < len; i++) {
    const testCase = cases[i];
    progress.innerText = `${i}/${len}`;
    const startTime = Date.now();
    let loaded = 0;
    speed = 0;
    try {
      let startTime2 = startTime;
      await axios.get(testCase.link + '?ts=' + Date.now(), {
        onDownloadProgress(event) {
          const now = Date.now();
          const time = now - startTime2;
          speed = (event.loaded - loaded) / time * 1000 / 1024 / 1024 * 8;
          loaded = event.loaded;
          startTime2 = now;
          showSpeed(Math.round(speed * 100) / 100);
        },
      });
      progress.innerText = `${i + 1}/${len}`;
    } catch (e) {
      showItemError(i);
    }
    const time = Date.now() - startTime;
    speed = loaded / time * 1000 / 1024 / 1024 * 8;
    score += oneScore * speed / MAX_SCORE_SPEED;
    showItemSpeed(i, Math.round(speed / MAX_SCORE_SPEED * 5));
    await sleep(500);
  }

  clock.classList.add('animated', 'zoomOut');
  await sleep(500);
  clock.hidden = true;
  clock.classList.remove('animated', 'zoomOut');
  result.hidden = false;
  result.classList.add('animated', 'zoomIn');
  await sleep(100);
  startTitle.hidden = true;
  resultTitle.hidden = false;
  result.style.setProperty('--number', Math.round(score).toString());
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
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  clockBg.style['-webkit-mask-image'] = 'url(' + url + ')';
}
function showItemSpeed(index, score) {
  score = score > 5 ? 5 : score;
  score = score < 1 ? 1 : score;
  const item = document.getElementsByClassName('test-item')[index];
  const stars = item.getElementsByClassName('star');
  for (let i = 0; i < score; i++) {
    stars[i].classList.add('light');
  }
}
function showItemError(index) {
  const item = document.getElementsByClassName('test-item')[index];
  item.classList.add('error');
}

if (devMode) {
  window.showSpeed = showSpeed;
  window.showItemSpeed = showItemSpeed;
} else {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-25873290-18');
}



