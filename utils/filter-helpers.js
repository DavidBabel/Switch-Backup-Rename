const levenshtein = require('js-levenshtein');
var readlineSync = require('readline-sync');

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
    .replace('-cut', '')
    .replace(/[^a-zA-Z0-9+]/g,'');

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

function userValidation(searchPattern, gameName) { 
  console.log(
    `- We matched the file named: '${searchPattern}' against the game found in the database : '${gameName}'`
 );
    
 // Wait for user's response.
  var answer = readlineSync.question('Could you confirm this match is correct? (y/n)');
 
  if (answer == 'y') {
     return true;
  }

  return false;
};

function getCurrentGameInfo(searchPattern, gamesInfos) {
  var sanitizedSearchPattern = sanitizeFileName(searchPattern);

  for (let i = 0; i < gamesInfos.length; i++) {
    const gameInfos = gamesInfos[i];
    if (gameInfos.serial) {
      if (sanitizedSearchPattern.includes(sanitizeSerial(gameInfos.serial))) {
        return gameInfos;
      }
    }
  }
  // fallback on filename
  for (let i = 0; i < gamesInfos.length; i++) {
    const gameInfos = gamesInfos[i];
    if (gameInfos.filename) {
      if (sanitizedSearchPattern.includes(sanitizeSerial(gameInfos.filename))) {
        return gameInfos;
      }
    }
  }
  // This one is maybe useless now ? 
  // for (let i = 0; i < gamesInfos.length; i++) {
  //   const gameInfos = gamesInfos[i];
  //   if (gameInfos.releasename) {
  //     if (sanitizeSerial(gameInfos.releasename).includes(sanitizedSearchPattern)) {
  //       return gameInfos;
  //     }
  //   }
  // }

  // fallback on name
  for (let i = 0; i < gamesInfos.length; i++) {
    const gameInfos = gamesInfos[i];
    if (gameInfos.name) {
      var sanitizedName = sanitizeFileName(gameInfos.name);
      
      var alreadyCheckByUser = false;
      // Check first if the name of the game match somewhere
      if (sanitizedName.includes(sanitizedSearchPattern) || sanitizedSearchPattern.includes(sanitizedName)) {
        if (userValidation(searchPattern, gameInfos.name)) {
          return gameInfos;
        }
        alreadyCheckByUser = true;
      }
      
      // Last change using the levenshtein algorithm + user control
      var levenshteinDistance = levenshtein(sanitizedName, sanitizedSearchPattern);
      var result = (1 - levenshteinDistance/Math.max(sanitizedName.length,sanitizedSearchPattern.length)) * 100;

       if ( result >= 75 && !alreadyCheckByUser) { 
         // Comment this out if you want to debug :) (except the return)
        if (userValidation(searchPattern, gameInfos.name)) {
          return gameInfos;
        }
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
