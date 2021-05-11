import './styl/screen.styl';

const clock = document.getElementById('clock');
const clockBg = document.getElementById('clock-color');
const number = document.getElementById('speed-number');
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
