'use strict';

// source: https://medium.com/@svilen/auto-updating-apps-for-windows-and-osx-using-electron-the-complete-guide-4aa7a50b904c#.dwte8fisz

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');


app.use(require('morgan')('dev'));

app.get('/', (req, res) => {
  const latest = getLatestRelease();
  res.render('index', {
      url: `${getBaseUrl()}/updates/releases/darwin/${latest}/shellviz.zip`
  });
});
app.get('/docs', (req, res) => {
  res.render('docs')
});


app.use('/updates/releases', express.static(path.join(__dirname, 'releases')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/updates/latest', (req, res) => {
  const latest = getLatestRelease();
  const clientVersion = req.query.v;

  if (clientVersion === latest) {
    res.status(204).end();
  } else {
    res.json({
      url: `${getBaseUrl()}/updates/releases/darwin/${latest}/shellviz.zip`
    });
  }
});

let getLatestRelease = () => {
  const dir = `${__dirname}/releases/darwin`;

  const versionsDesc = fs.readdirSync(dir).filter((file) => {
    const filePath = path.join(dir, file);
    return fs.statSync(filePath).isDirectory();
  }).reverse();

  return versionsDesc[0];
}

let getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  } else {
    return 'http://shellviz.com'
  }
}

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
