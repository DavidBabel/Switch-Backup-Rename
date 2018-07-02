const path = require('path');

function cwd(additionnalPath = '') {
  return path.join(path.dirname(process.execPath), additionnalPath);
}

module.exports = {
  cwd
};
