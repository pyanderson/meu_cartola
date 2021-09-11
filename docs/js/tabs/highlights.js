'use strict';

function find_max_by_sector(key) {
  return Object.values(db.teams).reduce(function (a, b) {
    if (a[key]['total'] == b[key]['total']) {
      return a[key]['media'] > b[key]['media'] ? a : b;
    }
    return a[key]['total'] > b[key]['total'] ? a : b;
  });
}

function find_min_by_sector(key) {
  return Object.values(db.teams).reduce(function (a, b) {
    if (a[key]['total'] == b[key]['total']) {
      return a[key]['media'] < b[key]['media'] ? a : b;
    }
    return a[key]['total'] < b[key]['total'] ? a : b;
  });
}

function render_highlights_tab() {
  const state_id = 'highlights_tab';
  if (state[state_id] == 'done') return;
  fetch_highlights()
    .then(function () {
      const deck = []
      const deck_size = 6;
      for (const [name, data] of Object.entries(db.highlights)) {
        data['title'] = name.split('_').join(' ');
      }
      for (const data of Object.values(db.highlights).sort(function (x, y) {return x.pos - y.pos})) {
        deck.push(data);
        if (deck.length % deck_size == 0) {
          $("#highlights").append(render_highlight_card_deck(deck));
          deck.length = 0;
        }
      }
      if (deck.length > 0) {
        $("#highlights").append(render_highlight_card_deck(deck));
      }
      state[state_id] = 'done';
    });
  fetch_teams()
    .then(function () {
      const cmp_by_points = function (a, b) {
        return a[1]['pontos'][a[1]['pontos'].length - 1] - b[1]['pontos'][b[1]['pontos'].length - 1];
      };
      for (const [name, data] of Object.entries(db.teams).sort(cmp_by_points).reverse()) {
        $('#highlights-table').append(render_highlight_row(name, data));
      }
    });
  fetch_teams()
    .then(function () {
      const defense = find_max_by_sector('defesa');
      const middle = find_max_by_sector('meio_campo');
      const attack = find_max_by_sector('ataque');
      const worst_defense = find_min_by_sector('defesa');
      const worst_middle = find_min_by_sector('meio_campo');
      const worst_attack = find_min_by_sector('ataque');
      $("#sectors").append(render_sectors_card_deck(defense, middle, attack, worst_defense, worst_middle, worst_attack));
    });
}
