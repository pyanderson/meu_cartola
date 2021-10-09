'use strict';

const host = window.location.host == '' ? 'meucartola.pyanderson.dev' : window.location.host;
const actual_round = 24;
const user_data = {'team': {}};
const db = {'rounds': {}, 'best_rounds': {}};
const state = {};
const positions = ['gol', 'lat', 'zag', 'mei', 'ata', 'tec'];

$(document).ready(function () {
  render_points_tab();
  $('#positions-tab-nav').click(render_positions_tab);
  $('#patrimony-tab-nav').click(render_patrimony_tab);
  $('#top-tab-nav').click(render_top_tab);
  $('#highlights-tab-nav').click(render_highlights_tab);
  $('#simulation-tab-nav').click(render_simulation_tab);
  $('#best-tab-nav').click(render_best_tab);
});
