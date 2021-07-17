"use strict";

function render_highlight_card(title, data) {
  return `
  <div class="card text-center">
    <div class="card-header text-capitalize">${title}</div>
    <img class="card-img-top" src="data/escudos/${data['nome']}.png" alt="${data['nome']}">
    <div class="card-body">
      <h4 class="card-title">${data['nome']}</h4>
    </div>
    <div class="card-footer">${data['total']} vezes</div>
  </div>
    `;
}

function render_highlight_row(name, data) {
  return `
  <tr>
    <td><img class="img-thumbnail" src="data/escudos/${name}.png" alt="${name}" width="50" height="53"> ${name}</td>
    <td class="text-center">${data['melhor_da_rodada']}</td>
    <td class="text-center">${data['pior_da_rodada']}</td>
    <td class="text-center">${data['maior_valorização_da_rodada']}</td>
    <td class="text-center">${data['pior_valorização_da_rodada']}</td>
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
