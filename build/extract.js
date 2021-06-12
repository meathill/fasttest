const pug = require('pug');
const {
  promises: {
    writeFile,
  },
} = require('fs');
const { resolve } = require('path');

const file = resolve(__dirname, '../src/template/index.pug');

const texts = new Set();

pug.renderFile(file, {
  __(str) {
    texts.add(str);
  },
  require() {

  },
  cases: [],
  langs: [],
});

(async() => {
  const baseLang = resolve(__dirname, '../src/data/base-lang');
  await writeFile(baseLang, [...texts].join('\n'), 'utf8');
})();
