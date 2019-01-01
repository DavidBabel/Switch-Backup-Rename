function sanitizeSerial(str) {
  return str
    .toLowerCase()
    .replace(/^la-n-/, '')
    .replace(/^la-h-/, '')
    .trim();
}

function sanitizeFileName(str) {
  return cleanExtension(str)
    .toLowerCase()
    .replace(/^.*?la-n-/, '')
    .replace(/^.*?la-h-/, '')
    .replace(/^.*?bbb-h-/, '')
    .replace(/^.*?cat-/, '')
    .replace(/^.*?lfc-/, '')
    .replace(/^.*?v-/, '')
    .replace(/^.*?hr-/, '')
    .replace('-cut', '');
}

function cleanExtension(str) {
  return str
    .replace(/.xci$/, '')
    .replace(/.nsp$/, '')
    .trim();
}

function keepOnlyOneDot(str) {
  const elements = str.split('.');
  const ext = elements.pop();
  return elements.join(' ') + '.' + ext;
}

function cleanFileName(str) {
  return keepOnlyOneDot(
    str
      .replace(/:/g, ' ')
      .replace(/\+/g, ' ')
      .replace(/{/g, ' ')
      .replace(/}/g, ' ')
      .replace(/,/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\*/g, ' ')
      .replace(/\//g, ' ')
      .replace(/\\/g, ' ')
      .replace(/\?/g, ' ')
      .replace(/!/g, ' ')
      .replace(/"/g, ' ')
      .replace(/</g, ' ')
      .replace(/>/g, ' ')
      .replace(/\|/g, ' ')
      .replace(/\s\s+/g, ' ')
      .trim()
  );
}

function getCurrentGameInfo(searchPattern, gamesInfos) {
  for (let i = 0; i < gamesInfos.length; i++) {
    const gameInfos = gamesInfos[i];
    if (gameInfos.serial) {
      const regexp = new RegExp(sanitizeSerial(gameInfos.serial));
      if (regexp.test(searchPattern.toLowerCase())) {
        return gameInfos;
      }
    }
  }
  // fallback on filename
  for (let i = 0; i < gamesInfos.length; i++) {
    const gameInfos = gamesInfos[i];
    if (gameInfos.filename) {
      const regexp = new RegExp(sanitizeFileName(gameInfos.filename));
      if (regexp.test(searchPattern.toLowerCase())) {
        return gameInfos;
      }
    }
  }
  // fallback on releasename
  for (let i = 0; i < gamesInfos.length; i++) {
    const gameInfos = gamesInfos[i];
    if (gameInfos.releasename) {
      const regexp = new RegExp(sanitizeFileName(gameInfos.releasename));
      if (regexp.test(searchPattern.toLowerCase())) {
        return gameInfos;
      }
    }
  }
  return false;
}

module.exports = {
  sanitizeSerial,
  getCurrentGameInfo,
  cleanExtension,
  cleanFileName
};
