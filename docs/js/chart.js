"use strict";

function load_highlights() {
  fetch(`https://${host}/data/destaques.json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (highlights) {
      const deck = []
      for (const [name, data] of Object.entries(highlights)) {
        data['title'] = name.split('_').join(' ');
      }
      for (const data of Object.values(highlights).sort(function (x, y) {
        return x['pos'] - y['pos'];
      })) {
        deck.push(data);
        if (deck.length % 4 == 0) {
          $("#highlights").append(render_highlight_card_deck(deck));
          deck.length = 0;
        }
      }
      if (deck.length > 0) {
        $("#highlights").append(render_highlight_card_deck(deck));
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
      const cmp_by_points = function (a, b) {
        return a[1]['pontos'][a[1]['pontos'].length - 1] - b[1]['pontos'][b[1]['pontos'].length - 1];
      };
      for (const [name, data] of Object.entries(teams).sort(cmp_by_points).reverse()) {
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

$(document).ready(function () {
  load_league();
  load_highlights();
});
