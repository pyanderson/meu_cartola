"use strict";

function load_league_stats() {
  fetch(`https://${host}/data/liga.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (league) {
      const cmp_by_points = function (a, b) {
        return a['pontos'] - b['pontos'];
      };
      const cmp_by_presence = function (a, b) {
        return a['escalado'] - b['escalado'];
      };
      for (const player of Object.values(league['atletas']).sort(cmp_by_points).reverse().slice(0, 5)){
        $('#top-points-table').append(render_top_row(player));
      }
      for (const player of Object.values(league['atletas']).sort(cmp_by_presence).reverse().slice(0, 5)){
        $('#top-presence-table').append(render_presence_row(player));
      }
      for (const team of Object.values(league['clubes']).sort(cmp_by_points).reverse().slice(0, 5)){
        $('#top-team-points-table').append(render_top_team_row(team));
      }
      for (const team of Object.values(league['clubes']).sort(cmp_by_presence).reverse().slice(0, 5)){
        $('#top-team-presence-table').append(render_presence_team_row(team));
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

$(document).ready(function () {
  load_league_stats();
});
