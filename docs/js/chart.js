"use strict";

function load_highlights() {
  fetch(`https://${host}/data/destaques.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (highlights) {
      for (const [name, data] of Object.entries(highlights)) {
        const title = name.split('_').join(' ');
        $("#highlights").append(render_highlight_card(title, data));
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function load_league() {
  fetch(`https://${host}/data/times.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (teams) {
      const points = [];
      const positions = [];
      const patrimony = [];
      for (const [name, data] of Object.entries(teams)) {
        points.push({
          'x': data['rodadas'],
          'y': data['pontos'],
          'name': name
        });
        positions.push({
          'x': data['rodadas'].slice(1),
          'y': data['posicoes'],
          'name': name
        });
        patrimony.push({
          'x': data['rodadas'],
          'y': data['patrimonio'],
          'name': name
        });
        $('#highlights-table').append(render_highlight_row(name, data));
      }
      const cmp = function (a, b) {
        return a['y'][a['y'].length - 1] - b['y'][b['y'].length - 1]
      }
      points.sort(cmp);
      points.reverse();
      positions.sort(cmp);
      patrimony.sort(cmp);
      patrimony.reverse();
      Plotly.newPlot('points', points, {'xaxis': {'title': 'Rodadas'}, 'yaxis': {'title': 'Pontos'}})
        .then(function (chart) {
          Plotly.newPlot('positions', positions,
            {
              'xaxis': {'title': 'Rodadas'},
              'yaxis': {'title': 'Posições', 'autorange': 'reversed'},
              'width': chart.scrollWidth,
              'height': chart.scrollHeight
            });
          Plotly.newPlot('patrimony', patrimony,
            {
              'xaxis': {'title': 'Rodadas'},
              'yaxis': {'title': 'Patrimônio'},
              'width': chart.scrollWidth,
              'height': chart.scrollHeight
            });
        });
    })
    .catch(function (err) {
      console.log(err);
    });
}

$(document).ready(function() {
  load_league();
  load_highlights();
});