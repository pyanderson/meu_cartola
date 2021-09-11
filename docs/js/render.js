'use strict';

function render_top_player_row(player) {
  return `
  <tr>
    <td class="text-center"><img class="img-thumbnail" src="${player['clube']['escudos']['45x45']}" alt="${player['clube']['nome']}" width="45" height="45"></td>
    <td class="text-left"><img class="img-thumbnail" src="${player['foto'].replace('FORMATO', '50x50')}" alt="${player['apelido']}" width="45" height="45"> ${player['apelido']}</td>
    <td class="text-center">${player['pontos'].toFixed(2)}</td>
  </tr>
  `;
}

function render_presence_player_row(player) {
  return `
  <tr>
    <td class="text-center"><img class="img-thumbnail" src="${player['clube']['escudos']['45x45']}" alt="${player['clube']['nome']}" width="45" height="45"></td>
    <td class="text-left"><img class="img-thumbnail" src="${player['foto'].replace('FORMATO', '50x50')}" alt="${player['apelido']}" width="45" height="45"> ${player['apelido']}</td>
    <td class="text-center">${player['escalado']}</td>
  </tr>
  `;
}

function render_top_players(players_by_points, players_by_presence) {
  const points_rows = players_by_points.reduce(function (rows, player) {
    return rows += render_top_player_row(player);
  }, '');
  const presence_rows = players_by_presence.reduce(function (rows, player) {
    return rows += render_presence_player_row(player);
  }, '');
  return `
        <div class="row">
          <div class="col-sm-12 mt-3">
            <h3 class="text-center">Jogadores</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6 mt-3">
            <h5 class="text-center">Top Pontuadores</h5>
            <div class="table-responsive mt-3">
              <table class="table table-striped table-hover">
                <thead class="text-center">
                  <tr>
                    <th>Clube</th>
                    <th class="text-left">Nome</th>
                    <th>Pontuação</th>
                  </tr>
                </thead>
                <tbody>${points_rows}</tbody>
              </table>
            </div>
          </div>
          <div class="col-sm-6 mt-3">
            <h5 class="text-center">Mais Escalados</h5>
            <div class="table-responsive mt-3">
              <table class="table table-striped table-hover">
                <thead class="text-center">
                  <tr>
                    <th>Clube</th>
                    <th class="text-left">Nome</th>
                    <th>Escalado</th>
                  </tr>
                </thead>
                <tbody>${presence_rows}</tbody>
              </table>
            </div>
          </div>
        </div>
  `;
}

function render_top_team_row(team) {
  return `
  <tr>
    <td class="text-left"><img class="img-thumbnail" src="${team['escudos']['45x45']}" alt="${team['nome']}" width="45" height="45"> ${team['nome']}</td>
    <td class="text-center">${team['pontos'].toFixed(2)}</td>
  </tr>
  `;
}

function render_presence_team_row(team) {
  return `
  <tr>
    <td class="text-left"><img class="img-thumbnail" src="${team['escudos']['45x45']}" alt="${team['nome']}" width="45" height="45"> ${team['nome']}</td>
    <td class="text-center">${team['escalado']}</td>
  </tr>
  `;
}

function render_top_teams(teams_by_points, teams_by_presence) {
  const points_rows = teams_by_points.reduce(function (rows, team) {
    return rows += render_top_team_row(team);
  }, '');
  const presence_rows = teams_by_presence.reduce(function (rows, team) {
    return rows += render_presence_team_row(team);
  }, '');
  return `
        <div class="row">
          <div class="col-sm-12 mt-3">
            <h3 class="text-center">Clubes</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6 mt-3">
            <h5 class="text-center">Top Pontuadores</h5>
            <div class="table-responsive mt-3">
              <table class="table table-striped table-hover">
                <thead class="text-center">
                  <tr>
                    <th class="text-left">Clube</th>
                    <th>Pontuação</th>
                  </tr>
                </thead>
                <tbody>${points_rows}</tbody>
              </table>
            </div>
          </div>
          <div class="col-sm-6 mt-3">
            <h5 class="text-center">Mais Escalados</h5>
            <div class="table-responsive mt-3">
              <table class="table table-striped table-hover">
                <thead class="text-center">
                  <tr>
                    <th class="text-left">Clube</th>
                    <th>Escalado</th>
                  </tr>
                </thead>
                <tbody>${presence_rows}</tbody>
              </table>
            </div>
          </div>
        </div>
  `;
}

function render_team_option(name) {
  return `<option value="${name}">${name}</option>`
}

function render_highlight_card(data) {
  return `
  <div class="card text-center mt-3 mb-3">
    <div class="card-header text-capitalize small">${data['title']}</div>
    <img class="card-img-top" src="data/escudos/${data['nome']}.png" alt="${data['nome']}">
    <div class="card-body">
      <h4 class="card-title small">${data['nome']}</h4>
    </div>
    <div class="card-footer small">${data['total']} ${data['desc']}</div>
  </div>
    `;
}

function render_highlight_card_deck(highlights) {
  const content = highlights.reduce(function (value, data) {
    return value + render_highlight_card(data);
  }, '')
  return `
  <div class="card-deck">
  ${content}
  </div>
  `;
}

function render_sector_card(title, data, sector, bg) {
  return `
    <div class="card text-center mt-3 mb-3">
      <div class="card-header text-capitalize small bg-${bg}">${title}</div>
      <img class="card-img-top" src="data/escudos/${data['nome']}.png" alt="${data['nome']}">
      <div class="card-body">
        <h4 class="card-title small">${data['nome']}</h4>
      </div>
      <div class="card-footer small">Total: ${data[sector]['total'].toFixed(2)} Média: ${data[sector]['media'].toFixed(2)}</div>
    </div>
  `;
}

function render_sectors_card_deck(defense, middle, attack, worst_defense, worst_middle, worst_attack) {
  return `
  <div class="card-deck">
  ${render_sector_card('Defesa', defense, 'defesa', 'info')}
  ${render_sector_card('Meio Campo', middle, 'meio_campo', 'info')}
  ${render_sector_card('Ataque', attack, 'ataque', 'info')}
  ${render_sector_card('Defesa', worst_defense, 'defesa', 'success')}
  ${render_sector_card('Meio Campo', worst_middle, 'meio_campo', 'success')}
  ${render_sector_card('Ataque', worst_attack, 'ataque', 'success')}
  </div>
  `;
}

function render_highlight_row(name, data) {
  return `
  <tr>
    <td><img class="img-thumbnail" src="data/escudos/${name}.png" alt="${name}" width="50" height="53"></td>
    <td>${name}</td>
    <td class="text-center">${data['melhor_da_rodada']}</td>
    <td class="text-center">${data['pior_da_rodada']}</td>
    <td class="text-center">${data['maior_valorização']}</td>
    <td class="text-center">${data['pior_valorização']}</td>
    <td class="text-center">${data['scout']['G']}</td>
    <td class="text-center">${data['scout']['A']}</td>
    <td class="text-center">${data['scout']['SG']}</td>
    <td class="text-center">${data['scout']['GS']}</td>
    <td class="text-center">${data['scout']['CA']}</td>
    <td class="text-center">${data['scout']['CV']}</td>
  </tr>
  `;
}

function render_team_table_empty_content(pos) {
  return `
  <td class="text-center text-uppercase">${pos}</td>
  <td class="text-left"></td>
  <td class="text-center"></td>
  <td class="text-center"></td>
  <td class="text-center"></td>
  <td class="text-center"></td>
  <td class="text-center"></td>
  `;
}

function render_team_table_empty_row(tr_id, pos) {
  return `
  <tr id="${tr_id}">
    ${render_team_table_empty_content(pos)}
  </tr>
  `;
}

function render_player_row(pos, player, player_team, name) {
  return `
  <td class="text-center text-uppercase" name="${name}">${pos}</td>
  <td class="text-left">${player['apelido']}</td>
  <td class="text-center">
    <img class="img-thumbnail" src="${player_team['escudos']['30x30']}" alt="${player_team['nome']}" width="30" height="30">
    <p style="display: none;">${player_team['nome']}</p>
  </td>
  <td class="text-center">$ ${player['preco_anterior'].toFixed(2)}</td>
  <td class="text-center">$ ${player['variacao'].toFixed(2)}</td>
  <td class="text-center">${player['pontuacao'].toFixed(2)}</td>
  `;
}

function render_team_table_content(pos, player, player_team) {
  return `
  ${render_player_row(pos, player, player_team, 'team-position')}
  <td class="text-center">
    <button type="button" class="btn btn-danger" name="team-player-button" id="team-player-button-${player['id']}" value="-"><i class="fas fa-minus"></i></button>
    <button type="button" class="btn btn-danger" name="team-captain-button" id="team-captain-button-${player['id']}" value="-"><i class="fas fa-copyright"></i></button>
  </td>
  `;
}

function render_players_table_row(pos, player, player_team) {
  return `
  <tr id="player-tr-${player['id']}">
    ${render_player_row(pos, player, player_team, 'position')}
    <td class="text-center"><button type="button" class="btn btn-success" name="player-button" id="player-button-${player['id']}" value="+"><i class="fas fa-plus"></i></button></td>
  </tr>
  `;
}

function render_action_button(btn, cls, value, symbol) {
  btn.prop('class', `btn btn-${cls}`);
  btn.val(value);
  btn.html(`<i class="fas fa-${symbol}">`);
}

function render_player_card(player) {
  const pos = positions[player['posicao_id'] - 1];
  return `
  <div class="card text-center${player['capitao'] ? ' bg-info' : ''}">
    <div class="card-body">
      <span class="card-text badge badge-primary text-uppercase">${pos}</span>
      <img class="mt-1 mb-1" src="${player['foto'].replace('FORMATO', '50x50')}" alt="${player['apelido']}" data-toggle="tooltip" title="${player['apelido']}" data-placement="bottom" width="45" height="45">
      <p class="card-text small">${player['pontos'].toFixed(2)}</p>
    </div>
    <div class="card-footer small">$ ${player['preco_anterior'].toFixed(2)}</div>
  </div>
  `;
}

function render_best_team_header(team) {
  return `
  <div class="row">
    <div class="col-sm-4">
      <table class="table table-striped table-bordered">
        <tbody>
          <tr>
            <td>Preço:</td>
            <td class="text-center">$ ${team['preco'].toFixed(2)}</td>
          </tr>
          <tr>
            <td>Valorização:</td>
            <td class="text-center">$ ${team['valorizacao'].toFixed(2)}</td>
          </tr>
          <tr>
            <td>Pontuação:</td>
            <td class="text-center">${team['pontuacao'].toFixed(2)}</td>
          </tr>
          <tr>
            <td>Esquema:</td>
            <td class="text-center">${team['esquema']['nome']}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `;
}

function render_best_team(team) {
  const ids = [5, 4, 2, 3, 1, 6];
  const field = ids.reduce(function (content, id) {
    const players = team['jogadores'].filter(function (player) {
      return player['posicao_id'] == id;
    });
    if (id == 2) {
      players.splice(1, 0, 'empty', 'empty', 'empty');
    } else if (id == 6) {
      players.push('empty', 'empty', 'empty', 'empty');
    } else if (players.length == 1) {
      players.unshift('empty', 'empty');
      players.push('empty', 'empty');
    } else if (players.length == 2) {
      players.unshift('empty');
      players.splice(2, 0, 'empty');
      players.push('empty')
    } else if (players.length == 3) {
      players.unshift('empty');
      players.push('empty');
    } else if (players.length == 4) {
      players.splice(2, 0, 'empty');
    }
    const divs = players.reduce(function (value, player) {
      if (player == 'empty') {
        return value + '<div class="col-sm-2 mt-2 mb-2"></div>';
      }
      return value + `<div class="col-sm-2 mt-2 mb-2">${render_player_card(player)}</div>`;
    }, '<div class="col-sm-1 mt-2 mb-2"></div>') + '<div class="col-sm-1 mt-2 mb-2"></div>';
    return content + `<div class="row">${divs}</div>`;
  }, '');
  return `<div class="border border-primary mt-5 mb-5">${render_best_team_header(team)}${field}</div>`;
}
