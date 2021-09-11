'use strict';

function load_scheme() {
  const scheme = db.schemes[$('#scheme').val()];
  user_data['selected_scheme'] = scheme;
  reset_team_stats();
  $('#team-table').html('');
  positions.forEach(function (pos) {
    for (let i = 0; i < scheme['posicoes'][pos]; i++) {
      const tr_id = `team-${pos}-${i}`;
      $('#team-table').append(render_team_table_empty_row(tr_id, pos));
    }
  });
  if (user_data['players'] !== undefined) {
    load_players_table(user_data['players']);
  }
}

function load_schemes() {
  fetch_schemes()
    .then(function () {
      Object.values(db.schemes).forEach(function (scheme) {
        $('select[name="scheme"]').append(`<option value="${scheme['esquema_id']}">${scheme['nome']}</option>`);
      });
      load_scheme();
      // events
      $('#scheme').change(function () {
        load_scheme();
      });
    });
}

function refresh_players_table() {
  const action = {}
  if (Object.keys(user_data['team']).length == 0) {
    return
  }
  positions.forEach(function (pos) {
    if (Object.values(user_data['team'][pos]).findIndex(function (item) {return item == 'empty'}) == -1) {
      action[pos] = 'hide';
    } else {
      action[pos] = 'show'
    }
  });
  Object.values($('td[name="position"]')).forEach(function (element) {
    const td = $(element);
    const tr = td.parent();
    const pos = td.text()
    if (action[pos] == 'hide' && tr.find('button').val() == '+') {
      tr.hide();
    } else {
      tr.show();
    }
  });
}

function reset_team_stats() {
  if (!('selected_scheme' in user_data)) {
    return
  }
  user_data['team'] = {'gol': {}, 'lat': {}, 'zag': {}, 'mei': {}, 'ata': {}, 'tec': {}, 'points': 0, 'value': 0, 'variation': 0, captain: false, 'players': {}};
  positions.forEach(function (pos) {
    for (let i = 0; i < user_data['selected_scheme']['posicoes'][pos]; i++) {
      const tr_id = `team-${pos}-${i}`;
      user_data['team'][pos][tr_id] = 'empty';
    }
  });
}

function update_team_stats() {
  $('#team-value').html('$ ' + user_data['team']['value'].toFixed(2));
  $('#team-variation').html('$ ' + user_data['team']['variation'].toFixed(2));
  $('#team-points').html(user_data['team']['points'].toFixed(2));
}

function remove_player(id) {
  const player = user_data['players']['atletas'][id];
  const pos = positions[player['posicao_id'] - 1];
  for (const [tr_id, cur_player] of Object.entries(user_data['team'][pos])) {
    if (cur_player['id'] == player['id']) {
      $('#' + tr_id).html(render_team_table_empty_content(pos));
      const btn = $(`#player-button-${player['id']}`);
      render_action_button(btn, 'success', '+', 'plus');
      // update data
      user_data['team'][pos][tr_id] = 'empty';
      delete user_data['team']['players'][id]
      user_data['team']['points'] -= player['pontuacao'];
      user_data['team']['value'] -= player['preco_anterior'];
      user_data['team']['variation'] -= player['variacao'];
      if (user_data['team']['captain'] && user_data['team']['captain']['id'] == id) {
        remove_captain(id);
      }
      update_team_stats();
      return true;
    }
  }
  return false;
}

function add_captain(id) {
  const player = user_data['players']['atletas'][id];
  if (user_data['team']['captain']) {
    remove_captain(user_data['team']['captain']['id']);
  }
  user_data['team']['points'] += player['pontuacao'];
  user_data['team']['captain'] = player;
  update_team_stats();
}

function remove_captain(id) {
  const player = user_data['players']['atletas'][id];
  if (id in user_data['team']['players']) {
    user_data['team']['points'] -= player['pontuacao'];
    if (user_data['team']['captain'] && user_data['team']['captain']['id'] == id) {
      user_data['team']['captain'] = false;
    }
  }
  update_team_stats();
}

function add_player(id) {
  const player = user_data['players']['atletas'][id];
  const player_team = user_data['players']['clubes'][player['clube_id']];
  const pos = positions[player['posicao_id'] - 1];
  for (const [tr_id, space] of Object.entries(user_data['team'][pos])) {
    if (space == 'empty') {
      $('#' + tr_id).html(render_team_table_content(pos, player, player_team));

      // update data
      user_data['team'][pos][tr_id] = player;
      user_data['team']['players'][id] = player;
      user_data['team']['points'] += player['pontuacao'];
      user_data['team']['value'] += player['preco_anterior'];
      user_data['team']['variation'] += player['variacao'];
      update_team_stats();

      // events
      $('button[name="team-player-button"]').on('click', function (event) {
        event.preventDefault();
        const btn = $(this);
        const id = btn.attr('id').split('team-player-button-')[1];
        remove_player(id);
        refresh_players_table();
      });

      if (pos == 'tec') {
        $(`#team-captain-button-${player['id']}`).remove();
      } else {
        $('button[name="team-captain-button"]').on('click', function (event) {
          event.preventDefault();
          const btn = $(this);
          const id = btn.attr('id').split('team-captain-button-')[1];
          const value = btn.val();
          if (value == '+') {
            render_action_button(btn, 'danger', '-', 'copyright');
            remove_captain(id);
          }
          else if (value == '-') {
            render_action_button(btn, 'info', '+', 'copyright');
            add_captain(id);
          }
        });
      }
      return true;
    }
  }
  return false;
}

function load_players_table() {
  const valid_players = Object.entries(user_data['players']['atletas']).map(function (tuple) {
    tuple[1]['id'] = tuple[0];
    return tuple[1];
  })
    .filter(function (player) {
      return player['entrou_em_campo'];
    });
  const players_grouped = {};
  valid_players.forEach(function (player) {
    const key = positions[player['posicao_id'] - 1];
    if (!(key in players_grouped)) {
      players_grouped[key] = [];
    }
    players_grouped[key].push(player);
  });

  $('#players-table').html('');

  positions.forEach(function (pos) {
    players_grouped[pos].forEach(function (player) {
      const player_team = user_data['players']['clubes'][player['clube_id']];
      $('#players-table').append(render_players_table_row(pos, player, player_team));
    });
  });

  refresh_players_table();

  $('button[name="player-button"]').on('click', function (event) {
    event.preventDefault();
    const btn = $(this);
    const id = btn.attr('id').split('player-button-')[1];
    const value = btn.val();
    if (value == '+' && add_player(id)) {
      render_action_button(btn, 'danger', '-', 'minus');
      refresh_players_table();
    }
    else if (value == '-' && remove_player(id)) {
      render_action_button(btn, 'success', '+', 'plus');
      refresh_players_table();
    }
  });
}

function load_round(round) {
  fetch_round(round)
    .then(function () {
      user_data['round'] = round;
      user_data['players'] = db.rounds[round];
      load_players_table();
      reset_team_stats();
      $('#players-search').on('keyup', function () {
        const value = $(this).val().toLowerCase();
        $('#players-table tr').filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    })
}

function add_round_options() {
  for (let i = actual_round; i >= 1; i--) {
    $('select[name="round"]').append(`<option value="${i}">Rodada ${i}</option>`);
  }
  // events
  $('#round').change(function () {
    load_round($(this).val());
  });

  load_round(actual_round);
}

function render_simulation_tab() {
  const state_id = 'simulation_tab';
  if (state[state_id] == 'done') return;
  load_schemes();
  add_round_options();
  state[state_id] = 'done';
}
