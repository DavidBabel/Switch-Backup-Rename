function sanitizeSerial(str) {
  return str
    .toLowerCase()
    .replace('la-h-', '')
    .replace('bbb-h-', '')
    .replace('hr-', '');
}

function cleanXci(str) {
  return str.replace('.xci', '').replace('-cut', '');
}

function getCurrentGameInfo(searchPattern, gamesInfos) {
  for (let i = 0; i < gamesInfos.length; i++) {
    const gameInfos = gamesInfos[i];
    const regexp = new RegExp(sanitizeSerial(gameInfos.serial));
    if (regexp.test(searchPattern.toLowerCase())) {
      return gameInfos;
    }
  }
  console.log(`not found ${searchPattern}`);
  return false;
}

module.exports = {
  getCurrentGameInfo,
  cleanXci
};
