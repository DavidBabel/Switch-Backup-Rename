const fs = require('fs-extra');
const { getGamesInfos } = require('./utils/fetch-games-data');
const {
  getCurrentGameInfo,
  sanitizeSerial,
  cleanXci,
  cleanFileName
} = require('./utils/filter-helpers');
const { cwd } = require('./utils/system-helpers');

const outFormat = process.argv[2] || '{name}-{short-serial}.{ext}';

getGamesInfos()
  .then(gamesInfos => {
    fs.readdirSync(cwd()).forEach(file => {
      if (file.endsWith('.xci') || file.endsWith('.nsp')) {
        const originalExtension = file.substr(file.length - 3);
        const originalName = cleanXci(file);
        const currentGameInfo = getCurrentGameInfo(
          originalName,
          gamesInfos.datas
        );

        if (currentGameInfo) {
          const finalName = outFormat
            .replace('{base}', originalName)
            .replace('{name}', currentGameInfo.name)
            .replace(
              '{short-serial}',
              sanitizeSerial(currentGameInfo.serial.toLowerCase())
            )
            .replace('{serial}', currentGameInfo.serial.toLowerCase())
            .replace('{ext}', originalExtension);

          try {
            fs.renameSync(cwd(file), cwd(cleanFileName(finalName)));
          } catch (error) {
            // continue
          }
        } else {
          `Game infos not found for ${file}`;
        }
      }
    });
    console.log('Files written');
  })
  .catch(error => {
    console.log('something went wrong');
    console.log(error);
  });

// prevent windows closing
setInterval(function() {}, 3000);
