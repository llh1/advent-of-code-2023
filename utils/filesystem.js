const fs = require('fs');

const loadInput = (path) => fs.readFileSync(path, { encoding: 'utf8' }).split('\n');

module.exports = {
  loadInput,
};