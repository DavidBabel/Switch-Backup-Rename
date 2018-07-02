const fs = require('fs-extra');
const { getGamesInfos } = require('./utils/fetch-games-data');
const {
  getCurrentGameInfo,
  cleanXci,
  cleanFileName
} = require('./utils/filter-helpers');
const { cwd } = require('./utils/system-helpers');

const outFormat = process.argv[2] || '{base}-{name}.txt';

getGamesInfos()
  .then(gamesInfos => {
    fs.readdirSync(cwd()).forEach(file => {
      if (file.endsWith('.xci')) {
        const originalName = cleanXci(file);
        const currentGameInfo = getCurrentGameInfo(
          originalName,
          gamesInfos.datas
        );

        if (currentGameInfo) {
          const finalName = outFormat
            .replace('{base}', originalName)
            .replace('{name}', currentGameInfo.name);

          try {
            fs.createFileSync(cwd(cleanFileName(finalName)));
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
