"use strict";

function load_best_round(round) {
  fetch(`https://${host}/data/melhores-esquemas/rodada-${round}.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (schemes) {
      user_data['best-teams'] = schemes.sort(function (x, y) {
        return y['pontuacao'] - x['pontuacao'];
      });
      $("#best").html('');
      user_data['best-teams'].forEach(function (team) {
        $("#best").append(render_best_team(team));
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}


function add_best_round_options() {
  for (let i = actual_round; i >= 1; i--) {
    $('select[name="best-round"]').append(`<option value="${i}">Rodada ${i}</option>`);
  }
  // events
  $('#best-round').change(function() {
    load_best_round($(this).val());
  });

  load_best_round(actual_round);
}


$(document).ready(function() {
  add_best_round_options();
});
