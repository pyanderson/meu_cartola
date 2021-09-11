'use strict';

function render_positions_tab() {
  const state_id = 'positions_tab';
  if (state[state_id] == 'done') return;
  fetch_teams()
    .then(function () {
      const positions = [];
      for (const [name, data] of Object.entries(db.teams)) {
        positions.push({
          'x': data['rodadas'].slice(1),
          'y': data['posicoes'],
          'name': name
        });
      }
      positions.sort(function (a, b) {return a.y[a.y.length - 1] - b.y[b.y.length - 1]});
      Plotly.newPlot('positions', positions,
        {
          'xaxis': {'title': 'Rodadas'},
          'yaxis': {'title': 'Posições', 'autorange': 'reversed'},
          'width': db.chart_width || 1110,
          'height': db.chart_height || 450,
        });
      state[state_id] = 'done';
    });
}
