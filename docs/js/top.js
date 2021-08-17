"use strict";

function top_n(ls, cmp, n) {
  return ls.sort(cmp).reverse().slice(0, n);
}

function load_league_stats() {
  fetch(`https://${host}/data/liga.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (league) {
      const top_size = 5;
      const cmp_by_points = function (a, b) {
        return a['pontos'] - b['pontos'];
      };
      const cmp_by_presence = function (a, b) {
        return a['escalado'] - b['escalado'];
      };
      for (const player of top_n(Object.values(league['atletas']), cmp_by_points, top_size)) {
        $('#top-points-table').append(render_top_row(player));
      }
      for (const player of top_n(Object.values(league['atletas']), cmp_by_presence, top_size)) {
        $('#top-presence-table').append(render_presence_row(player));
      }
      for (const team of top_n(Object.values(league['clubes']), cmp_by_points, top_size)) {
        $('#top-team-points-table').append(render_top_team_row(team));
      }
      for (const team of top_n(Object.values(league['clubes']), cmp_by_presence, top_size)) {
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
