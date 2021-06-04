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

app.post('/data', async(req, res, next) => {
  res.setHeader('Content-type', 'application/octet-stream');

  const { cases, lang } = req.body;
  const casesJS = 'module.exports = ' + JSON.stringify(cases, null, '  ') + '\n';
  let file = resolve(__dirname, '../src/data/case.js');
  await writeFile(file, casesJS, 'utf8');
  const langJS = 'module.exports = ' + JSON.stringify(lang, null, '  ') + '\n';
  file = resolve(__dirname, '../src/data/lang.js');
  await writeFile(file, langJS, 'utf8');

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
