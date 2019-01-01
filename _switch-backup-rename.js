const fs = require('fs-extra');
const accents = require('remove-accents');

const { getGamesInfos } = require('./utils/fetch-games-data');
const {
  getCurrentGameInfo,
  sanitizeSerial,
  cleanExtension,
  cleanFileName
} = require('./utils/filter-helpers');
const { cwd } = require('./utils/system-helpers');

const outFormat = process.argv[2] || '{name}-{short-serial}.{ext}';
let done = false;

getGamesInfos()
  .then(gamesInfos => {
    fs.readdirSync(cwd()).forEach(file => {
      if (file.endsWith('.xci') || file.endsWith('.nsp')) {
        const originalExtension = file.substr(file.length - 3);
        const originalName = cleanExtension(file);
        const currentGameInfo = getCurrentGameInfo(
          originalName,
          gamesInfos.datas
        );

        if (currentGameInfo) {
          const finalName = outFormat
            .replace('{base}', originalName.trim())
            .replace('{name}', currentGameInfo.name.trim())
            .replace('{short-serial}', sanitizeSerial(currentGameInfo.serial))
            .replace('{serial}', currentGameInfo.serial.toLowerCase().trim())
            .replace('{ext}', originalExtension);

          try {
            fs.renameSync(
              cwd(file),
              cwd(cleanFileName(accents.remove(finalName)))
            );
            done = true;
          } catch (error) {
            // continue
          }
        } else {
          console.log(
            `- game infos not found in database yet for ${originalName}`
          );
        }
      }
    });
    if (done) {
      console.log('Game Files renamed');
    } else {
      console.log('Nothing to do');
    }
  })
  .catch(error => {
    console.log('something went wrong');
    console.log(error);
  });

// prevent windows closing
setInterval(function() {}, 3000);
