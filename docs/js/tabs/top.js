'use strict';

function top_n(ls, cmp = 'points', n = 5) {
  const cmp_by_points = function (a, b) {
    return a['pontos'] - b['pontos'];
  };
  const cmp_by_presence = function (a, b) {
    return a['escalado'] - b['escalado'];
  };
  if (cmp == 'points')
    return ls.sort(cmp_by_points).reverse().slice(0, n);
  return ls.sort(cmp_by_presence).reverse().slice(0, n);
}

function load_team_top_n(team) {
  $('#top-player-players').html(
    render_top_players(
      top_n(Object.values(team['atletas'])),
      top_n(Object.values(team['atletas']), 'presence')
    )
  )
  $('#top-player-teams').html(
    render_top_teams(
      top_n(Object.values(team['clubes'])),
      top_n(Object.values(team['clubes']), 'presence')
    )
  )
}

function render_top_tab() {
  const state_id = 'top_tab';
  if (state[state_id] == 'done') return;
  fetch_league()
    .then(function () {
      $('#top-league-players').html(
        render_top_players(
          top_n(Object.values(db.league['atletas'])),
          top_n(Object.values(db.league['atletas']), 'presence')
        )
      )
      $('#top-league-teams').html(
        render_top_teams(
          top_n(Object.values(db.league['clubes'])),
          top_n(Object.values(db.league['clubes']), 'presence')
        )
      )
      state[state_id] = 'done';
    });
  fetch_teams()
    .then(function () {
      const cmp_by_points = function (a, b) {
        return a[1]['pontos'][a[1]['pontos'].length - 1] - b[1]['pontos'][b[1]['pontos'].length - 1];
      };
      for (const [name, _] of Object.entries(db.teams).sort(cmp_by_points).reverse()) {
        $('#team-select').append(render_team_option(name));
      }

      $('#team-select').change(function () {
        load_team_top_n(db.teams[$('#team-select').val()]);
      });
      load_team_top_n(db.teams[$('#team-select').val()]);
    });
}
