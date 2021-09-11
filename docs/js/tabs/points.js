'use strict';

function render_points_tab() {
  const state_id = 'points_tab';
  if (state[state_id] == 'done') return;
  fetch_teams()
    .then(function () {
      const points = [];
      for (const [name, data] of Object.entries(db.teams)) {
        points.push({
          'x': data['rodadas'],
          'y': data['pontos'],
          'name': name
        });
      }
      points.sort(function (a, b) {return a.y[a.y.length - 1] - b.y[b.y.length - 1]});
      points.reverse();
      Plotly.newPlot('points', points, {'xaxis': {'title': 'Rodadas'}, 'yaxis': {'title': 'Pontos'}})
        .then(function (chart) {
          db.chart_width = chart.scrollWidth;
          db.chart_height = chart.scrollHeight;
        });
      state[state_id] = 'done';
    });
}
