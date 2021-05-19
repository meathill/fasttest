const express = require('express');
const {
  promises: {
    writeFile,
  },
} = require('fs');
const webpack = require('webpack');
const webpackConfig = require('../build/webpack.config');

const app = express();
const port = 3100;

app.use(express.json());

app.get('/data', async (req, res, next) => {
  const cases = require('../src/data/case');
  const lang = require('../src/data/lang');

  res.send({
    cases,
    lang,
  });
});

app.post('/data', async (req, res, next) => {
  res.setHeader('Content-type', 'application/octet-stream');

  let {cases, lang} = req.body;
  cases = 'module.exports = ' . JSON.stringify(cases, null, '  ');
  await writeFile('../src/data/case.js', cases, 'utf8');
  lang = 'module.exports = ' . JSON.stringify(lang, null, '  ');
  await writeFile('../src/data/lang.js', lang, 'utf8');

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
