'use strict';

function render_patrimony_tab() {
  const state_id = 'patrimony_tab';
  if (state[state_id] == 'done') return;
  fetch_teams()
    .then(function () {
      const patrimony = [];
      for (const [name, data] of Object.entries(db.teams)) {
        patrimony.push({
          'x': data['rodadas'],
          'y': data['patrimonio'],
          'name': name
        });
      }
      patrimony.sort(function (a, b) {return a.y[a.y.length - 1] - b.y[b.y.length - 1]});
      patrimony.reverse();
      Plotly.newPlot('patrimony', patrimony,
        {
          'xaxis': {'title': 'Rodadas'},
          'yaxis': {'title': 'Patrimônio'},
          'width': db.chart_width || 1110,
          'height': db.chart_height || 450,
        });
      state[state_id] = 'done';
    });
}
