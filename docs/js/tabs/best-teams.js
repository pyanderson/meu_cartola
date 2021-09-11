'use strict';

function load_best_round(round) {
  fetch_best_round(round)
    .then(function () {
      user_data['best-teams'] = db.best_rounds[round].sort(function (x, y) {
        return y['pontuacao'] - x['pontuacao'];
      });
      $("#best").html('');
      user_data['best-teams'].forEach(function (team) {
        $("#best").append(render_best_team(team));
      });
      $('[data-toggle="tooltip"]').tooltip(); 
    })
    .catch(function (err) {
      console.log(err);
    });
}


function render_best_tab() {
  const state_id = 'best_tab';
  if (state[state_id] == 'done') return;
  for (let i = actual_round; i >= 1; i--) {
    $('select[name="best-round"]').append(`<option value="${i}">Rodada ${i}</option>`);
  }
  // events
  $('#best-round').change(function () {
    load_best_round($(this).val());
  });

  load_best_round(actual_round);
  state[state_id] = 'done';
}
