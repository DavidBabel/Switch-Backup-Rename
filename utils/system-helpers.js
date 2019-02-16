const path = require('path');

function cwd(additionnalPath = '') {
  var pathToUse = path.dirname(process.execPath);
  // Uncomment this for debugging purpose 
  // pathToUse = __dirname + "\\..\\debug";

  return path.join(pathToUse, additionnalPath);
}

module.exports = {
  cwd
};
