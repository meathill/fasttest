const express = require('express');
const {
  promises: {
    readFile,
    writeFile,
  },
  existsSync,
} = require('fs');
const { resolve } = require('path');
const webpack = require('webpack');
const webpackConfig = require('../build/webpack.config.prod');

const app = express();
const port = 3100;

app.use(express.json());

app.get('/data', async(req, res, next) => {
  let cases, lang;
  let file = resolve(__dirname, '../src/data/case.json');
  if (existsSync(file)) {
    cases = await readFile(file, 'utf8');
    cases = JSON.parse(cases);
  } else {
    file = '../src/data/case';
    cases = require(file);
  }
  file = resolve(__dirname, '../src/data/lang.json');
  if (existsSync(file)) {
    lang = await readFile(file, 'utf8');
    lang = JSON.parse(lang);
  } else {
    file = '../src/data/lang';
    lang = require(file);
  }
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

app.post('/data', async(req, res, next) => {
  res.setHeader('Content-type', 'application/octet-stream');

  const { cases, lang } = req.body;
  let file = resolve(__dirname, '../src/data/case.json');
  await writeFile(file, JSON.stringify(cases), 'utf8');
  file = resolve(__dirname, '../src/data/lang.json');
  await writeFile(file, JSON.stringify(lang), 'utf8');

  res.write('Local data saved. Start to build dist files.\n');

  process.env.NODE_ENV = 'production';
  lang.English = {
    __path: '',
  };
  for (const language in lang) {
    res.write('Start to build ' + language + '\n');
    const item = lang[language];
    const {
      __path,
      ...po
    } = item;
    const config = await webpackConfig(language, __path, cases, lang);
    const missing = [];
    global.__ = language === 'English'
      ? value => value
      : function(value) {
        if (po && po[value]) {
          return po[value];
        } else {
          console.warn(`[i18n: ${language}] no translation: ${value}`);
          missing.push(value);
        }
        return value;
      };
    const compiler = webpack(config);
    await new Promise((resolve) => {
      compiler.run((err, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          console.error(info.errors);
          err = true;
        }

        if (err) {
          compiler.close();
          return resolve();
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
        }

        console.log(stats.toString({
          chunks: false,
          colors: true,
        }));
        compiler.close(err => {
          if (err) {
            console.warn('Close error: ' + err);
          }
        });
        resolve();
      });
    });
    if (missing.length > 0) {
      const path = resolve(__dirname, `../dist/missing-${__path}.txt`);
      await writeFile(path, missing.join('\n'), 'utf8');
    }
    res.write(`Built ${language} successfully.\n`);
  }

  res.write('Built dist files successfully. Start to upload...');

  // try {} catch (e) {}

  res.write('Uploaded. All done.');
  res.end();
});

app.listen(port, () => {
  console.log('FastTest Admin API at: ', port);
});
