/* @flow */

const convert = require('xml-js');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const { cwd } = require('./system-helpers');

const gameFilePath = cwd('games.json');

function fetchGamesDatas() {
  return fetch('http://nswdb.com/xml.php', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/xml'
    }
  })
    .then(datas => datas.text())
    .then(xml =>
      convert.xml2json(xml, { compact: true, spaces: 2, textKey: 'text' })
    )
    .then(raw => JSON.parse(raw))
    .then(object => object.releases.release)
    .then(games => {
      const jsonGames = games.reduce((previous, next) => {
        const filtered = {};
        const keys = Object.keys(next);
        keys.forEach(key => {
          filtered[key] = next[key].text;
        });
        previous.push(filtered);
        return previous;
      }, []);
      return jsonGames;
    })
    .catch(e => `Error ${e}`);
}

function downloadGamesInfos() {
  return fetchGamesDatas()
    .then(result => {
      console.log(gameFilePath);
      try {
        fs.removeSync(gameFilePath);
      } catch (e) {
        // continue
      }
      fs.writeJsonSync(gameFilePath, {
        updated: new Date().getTime(),
        datas: result
      });
      return result;
    })
    .catch(e => {
      console.log('an error occurs', e);
      return false;
    });
}

function getGamesInfos() {
  return new Promise((resolve, reject) => {
    try {
      const gamesDatas = require(gameFilePath);
      if (new Date().getTime() - gamesDatas.updated > 5 * 24 * 3600 * 1000) {
        console.log('Old games.json file found: Update ...');
        throw 'Update games.json';
      }
      console.log('games.json file found');
      resolve(gamesDatas);
    } catch (error) {
      console.log('Download games.json file ...');
      return downloadGamesInfos()
        .then(result => {
          console.log('... Download finished');
          return resolve(result);
        })
        .catch(e => {
          reject(e);
        });
    }
  });
}

module.exports = {
  getGamesInfos
};
