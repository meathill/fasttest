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
    let error;
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
        timeout: 3E4,
      });
      progress.innerText = `${i + 1}/${len}`;
    } catch (e) {
      error = true;
      showItemError(i);
    }
    const time = Date.now() - startTime;
    const itemScore = error ? 0 : calcScore(loaded, time);
    score += oneScore * itemScore / 5;
    showItemSpeed(i, itemScore, error);
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

/**
 * @see https://github.com/meathill/fasttest/issues/18
 * @param {number} size
 * @param {number} time
 * @return {number}
 */
function calcScore(size, time) {
  const speed = size / time * 1000 / 1024 * 8;
  if (size <= 10240) { // <= 10k
    if (speed <= 15) {
      return 1;
    } else if (speed <= 30) {
      return 2;
    } else if (speed <= 50) {
      return 3;
    } else if (speed <= 200) {
      return 4;
    } else {
      return 5;
    }
  } else {
    if (speed <= 30) {
      return 1;
    } else if (speed <= 50) {
      return 2;
    } else if (speed <= 150) {
      return 3;
    } else if (speed <= 250) {
      return 4;
    } else {
      return 5;
    }
  }
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
  const svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="354" width="354" viewBox="0 0 20 20" style="transform: rotate(135deg)"><circle r="5" cx="10" cy="10" fill="transparent" stroke="tomato" stroke-width="10" stroke-dasharray="calc(${speed} / 100 * 0.75 * 31.415926) 31.415926"></circle></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  clockBg.style['-webkit-mask-image'] = 'url(' + url + ')';
}
function showItemSpeed(index, score, error) {
  score = score > 5 ? 5 : score;
  if (!error) {
    score = score < 1 ? 1 : score;
  }
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

if (devMode) {
  window.showSpeed = showSpeed;
  window.showItemSpeed = showItemSpeed;
} else {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments); // eslint-disable-line no-undef
  }
  gtag('js', new Date());

  gtag('config', 'UA-25873290-18');
}
