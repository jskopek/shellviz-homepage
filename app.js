'use strict';

// source: https://medium.com/@svilen/auto-updating-apps-for-windows-and-osx-using-electron-the-complete-guide-4aa7a50b904c#.dwte8fisz

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(require('morgan')('dev'));

app.use('/updates/releases', express.static(path.join(__dirname, 'releases')));

app.get('/updates/latest', (req, res) => {
  const latest = getLatestRelease();
  const clientVersion = req.query.v;

  if (clientVersion === latest) {
    res.status(204).end();
  } else {
    res.json({
      url: `${getBaseUrl()}/releases/darwin/${latest}/shellvis.zip`
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
    return 'http://shellvis.herokuapp.com'
  }
}

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
