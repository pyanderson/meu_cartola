"use strict";

function load_league_stats() {
  fetch(`https://${host}/data/liga.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (league) {
      $('#top-league-players').html(
        render_top_players(
          top_n(Object.values(league['atletas'])),
          top_n(Object.values(league['atletas']), 'presence')
        )
      )
      $('#top-league-teams').html(
        render_top_teams(
          top_n(Object.values(league['clubes'])),
          top_n(Object.values(league['clubes']), 'presence')
        )
      )
    })
    .catch(function (err) {
      console.log(err);
    });
}

$(document).ready(function () {
  load_league_stats();
});
