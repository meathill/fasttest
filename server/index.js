const express = require('express');
const {
  promises: {
    readFile,
    writeFile,
  },
  existsSync,
} = require('fs');
const {resolve} = require('path');
const webpack = require('webpack');
const webpackConfig = require('../build/webpack.config');

const app = express();
const port = 3100;

app.use(express.json());

app.get('/data', async (req, res, next) => {
  let cases = '../src/data/case';
  delete require.cache[resolve(cases)];
  cases = require(cases);
  let lang = '../src/data/lang';
  delete require.cache[resolve(lang)];
  lang = require(lang);
  let baseLang = resolve(__dirname, '../src/data/base-lang');
  if (existsSync(baseLang)) {
    baseLang = await readFile(baseLang, 'utf8');
    baseLang = baseLang.split('\n');
  }

  res.send({
    cases,
    lang,
    baseLang,
  });
});

app.post('/data', async (req, res, next) => {
  res.setHeader('Content-type', 'application/octet-stream');

  let {cases, lang} = req.body;
  cases = 'module.exports = ' + JSON.stringify(cases, null, '  ') + '\n';
  let file = resolve(__dirname, '../src/data/case.js');
  await writeFile(file, cases, 'utf8');
  lang = 'module.exports = ' + JSON.stringify(lang, null, '  ') + '\n';
  file = resolve(__dirname, '../src/data/lang.js');
  await writeFile(file, lang, 'utf8');

  res.write('Local data saved. Start to build...');

  const config = await webpackConfig();
  await webpack(config);

  res.write('Build dist files successfully. Start to upload...');

  // try {} catch (e) {}

  res.end();
});

app.listen(port, () => {
  console.log('FastTest Admin API at: ', port);
});
