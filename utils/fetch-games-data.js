/* @flow */

const convert = require('xml-js');
const fs = require('fs-extra');
const fetch = require('node-fetch');

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
      const test = games.reduce((previous, next) => {
        const filtered = {};
        const keys = Object.keys(next);
        keys.forEach(key => {
          filtered[key] = next[key].text;
        });
        previous.push(filtered);
        return previous;
      }, []);
      return test;
    })
    .catch(e => `Error ${e}`);
}

function downloadGamesInfos() {
  return fetchGamesDatas()
    .then(result => {
      try {
        fs.removeSync('games.json');
      } catch (e) {
        // continue
      }
      fs.writeJsonSync('games.json', {
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
      const gamesDatas = require('../games.json');
      if (new Date().getTime() - gamesDatas.updated > 5 * 24 * 3600 * 1000) {
        console.log('Old Game file Found: Update ...');
        throw 'Update Game';
      }
      console.log('Game File Found');
      resolve(gamesDatas);
    } catch (error) {
      console.log('Download Game File ...');
      return downloadGamesInfos()
        .then(result => {
          console.log('... Download Finished');
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
