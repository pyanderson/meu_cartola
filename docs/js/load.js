'use strict';

Array.prototype.toObject = function (key) {
  const obj = {};
  for (let i = 0; i < this.length; i++) {
    obj[this[i][key]] = this[i];
  }
  return obj;
};

function fetch_teams() {
  if ('teams' in db) return Promise.resolve();
  return fetch(`https://${host}/data/times.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (teams) {
      db.teams = teams;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function fetch_highlights() {
  if ('highlights' in db) return Promise.resolve();
  return fetch(`https://${host}/data/destaques.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (highlights) {
      db.highlights = highlights;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function fetch_league() {
  if ('league' in db) return Promise.resolve();
  return fetch(`https://${host}/data/liga.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (league) {
      db.league = league;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function fetch_schemes() {
  if ('schemes' in db) return Promise.resolve();
  return fetch(`https://${host}/data/esquemas.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (schemes) {
      db.schemes = schemes.toObject('esquema_id');
    })
    .catch(function (err) {
      console.log(err);
    });
}

function fetch_round(round) {
  if (round in db.rounds) return Promise.resolve();
  return fetch(`https://${host}/data/atletas/rodada-${round}.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (players) {
      db.rounds[round] = players;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function fetch_best_round(round) {
  if (round in db.best_rounds) return Promise.resolve();
  return fetch(`https://${host}/data/melhores-esquemas/rodada-${round}.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (schemes) {
      db.best_rounds[round] = schemes;
    })
    .catch(function (err) {
      console.log(err);
    });
}
