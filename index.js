require('./long-stacks.js');
const fs = require('fs');

function parseData (data, callback) {
  setTimeout(() => {
    callback(JSON.parse(data));
  }, 100);
}

function loadConfiguration (file, callback) {
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    parseData(data, callback);
  });
}

loadConfiguration('config.json', console.log);

process.on('uncaughtException', (e) => console.error('>> UNCAUGHT', e));
