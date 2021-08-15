import os
from operator import itemgetter

# local imports
from constants import (HIGHLIGHTS_PATH, LEAGUE_STATS_PATH, PLAYERS_FOLDER_PATH,
                       ROUNDS_PATH, SCHEMES_PATH, TEAMS_PATH)
from helpers import read_json, write_json


def rank(ls, key, teams):
    ls = sorted(ls, key=itemgetter(1), reverse=True)
    for i, (name, _) in enumerate(ls):
        teams[name][key].append(i+1)


def scout_getter(key):
    return lambda x: itemgetter(key)(itemgetter('scout')(x))


def generate_highlights(teams):
    best = max(teams.values(), key=itemgetter('melhor_da_rodada'))
    worst = max(teams.values(), key=itemgetter('pior_da_rodada'))
    rich = max(teams.values(), key=itemgetter('maior_valorização_da_rodada'))
    poor = max(teams.values(), key=itemgetter('pior_valorização_da_rodada'))
    scorer = max(teams.values(), key=scout_getter('G'))
    waiter = max(teams.values(), key=scout_getter('A'))
    solid_defense = max(teams.values(), key=scout_getter('SG'))
    inverse_scorer = max(teams.values(), key=scout_getter('GS'))
    wooden_leg = min(teams.values(), key=scout_getter('G'))
    fair_player = min(teams.values(), key=scout_getter('CV'))
    careless = max(teams.values(), key=scout_getter('CA'))
    quarrelsom = max(teams.values(), key=scout_getter('CV'))
    return {
        'melhor_da_rodada': {
            'nome': best['nome'],
            'total': best['melhor_da_rodada'],
            'desc': 'vezes',
            'pos': 0
        },
        'pior_da_rodada': {
            'nome': worst['nome'],
            'total': worst['pior_da_rodada'],
            'desc': 'vezes',
            'pos': 1
        },
        'maior_valorização_da_rodada': {
            'nome': rich['nome'],
            'total': rich['maior_valorização_da_rodada'],
            'desc': 'vezes',
            'pos': 2
        },
        'pior_valorização_da_rodada': {
            'nome': poor['nome'],
            'total': poor['pior_valorização_da_rodada'],
            'desc': 'vezes',
            'pos': 3
        },
        'goleador': {
            'nome': scorer['nome'],
            'total': scorer['scout']['G'],
            'desc': 'gols',
            'pos': 4
        },
        'garçom': {
            'nome': waiter['nome'],
            'total': waiter['scout']['A'],
            'desc': 'assitências',
            'pos': 5
        },
        'retranqueiro': {
            'nome': solid_defense['nome'],
            'total': solid_defense['scout']['SG'],
            'desc': 'SG garantidos',
            'pos': 6
        },
        'passa_tudo': {
            'nome': inverse_scorer['nome'],
            'total': inverse_scorer['scout']['GS'],
            'desc': 'gols sofridos',
            'pos': 7
        },
        'perna_de_pau': {
            'nome': wooden_leg['nome'],
            'total': wooden_leg['scout']['G'],
            'desc': 'gols',
            'pos': 8
        },
        'joga_limpo': {
            'nome': fair_player['nome'],
            'total': fair_player['scout']['CV'],
            'desc': 'cartões vermelhos',
            'pos': 9
        },
        'descuidado': {
            'nome': careless['nome'],
            'total': careless['scout']['CA'],
            'desc': 'cartões amarelos',
            'pos': 10
        },
        'briguento': {
            'nome': quarrelsom['nome'],
            'total': quarrelsom['scout']['CV'],
            'desc': 'cartões vermelhos',
            'pos': 11
        },
    }


def update_scouts(obj, player):
    for key, value in player['scout'].items():
        try:
            obj['scout'][key] += value
        except KeyError:
            obj['scout'][key] = value
    return obj


def update_player_data(dest, _team, player):
    actual = dest['atletas'].get(player['atleta_id'])
    if actual is None:
        actual = {'pontos': 0, 'scout': {}, 'escalado': 0}
    actual['escalado'] += 1
    actual['pontos'] += player['pontos_num']
    actual['foto'] = player['foto']
    actual['apelido'] = player['apelido']
    actual['clube'] = _team
    dest['atletas'][player['atleta_id']] = update_scouts(actual, player)


def update_team_data(dest, _team, player):
    actual = dest['clubes'].get(_team['id'])
    if actual is None:
        actual = {'pontos': 0, 'scout': {}, 'escalado': 0}
    actual.update(_team)
    actual['escalado'] += 1
    actual['pontos'] += player['pontos_num']
    dest['clubes'][_team['id']] = update_scouts(actual, player)


def get_scouts(teams):
    scouts = set()
    for team in teams.values():
        scouts.update(team['scout'].keys())
    return scouts


def set_missing_scouts(obj, scouts):
    for scout in scouts:
        if scout not in obj['scout']:
            obj['scout'][scout] = 0
    return obj


def add_missing_scouts(dest, scouts):
    for key, value in dest.items():
        dest[key] = set_missing_scouts(value, scouts)
    return dest


def generate_teams_data():
    rounds = read_json(ROUNDS_PATH, [])
    teams = {}
    league = read_json(LEAGUE_STATS_PATH, {'atletas': {}, 'clubes': {}})
    for _round in rounds:
        positions = []
        patrimony = []
        for team in _round:
            name = team['time']['nome']
            team['pontos'] = team['pontos'] or 0
            try:
                teams[name]['total'] = teams[name]['total'] + team['pontos']
                teams[name]['rodadas'].append(team['rodada_atual'])
                teams[name]['pontos'].append(teams[name]['total'])
                teams[name]['valorizacao'].append(
                    team['patrimonio'] - teams[name]['patrimonio'][-1]
                )
                teams[name]['patrimonio'].append(team['patrimonio'])
            except KeyError:
                teams[name] = {
                    'nome': name,
                    'total': team['pontos'],
                    'rodadas': [0, team['rodada_atual']],
                    'pontos': [0, team['pontos']],
                    'posicoes': [],
                    'patrimonio': [100, team['patrimonio']],
                    'valorizacao': [team['patrimonio'] - 100],
                    'melhor_da_rodada': 0,
                    'pior_da_rodada': 0,
                    'maior_valorização_da_rodada': 0,
                    'pior_valorização_da_rodada': 0,
                    'scout': {},
                    'atletas': {},
                    'clubes': {},
                }
            for player in team['atletas']:
                teams[name] = update_scouts(teams[name], player)
                try:
                    _team = team['clubes'][str(player['clube_id'])]
                except KeyError:
                    _team = {'id': player['clube_id'], 'nome': 'Sem Clube'}
                if team['capitao_id'] == player['atleta_id']:
                    player['pontos_num'] *= 2
                update_player_data(league, _team, player)
                update_player_data(teams[name], _team, player)
                update_team_data(league, _team, player)
                update_team_data(teams[name], _team, player)
            positions.append((name, teams[name]['total']))
            patrimony.append((name, teams[name]['valorizacao'][-1]))
        rank(positions, 'posicoes', teams)
        team = max(_round, key=itemgetter('pontos'))
        teams[team['time']['nome']]['melhor_da_rodada'] += 1
        team = min(_round, key=itemgetter('pontos'))
        teams[team['time']['nome']]['pior_da_rodada'] += 1
        patrimony = sorted(patrimony, key=itemgetter(1))
        teams[patrimony[-1][0]]['maior_valorização_da_rodada'] += 1
        teams[patrimony[0][0]]['pior_valorização_da_rodada'] += 1
    scouts = get_scouts(teams)
    league['atletas'] = add_missing_scouts(league['atletas'], scouts)
    league['clubes'] = add_missing_scouts(league['clubes'], scouts)
    teams = add_missing_scouts(teams, scouts)
    for team in teams.values():
        team['atletas'] = add_missing_scouts(team['atletas'], scouts)
    highlights = generate_highlights(teams)
    write_json(TEAMS_PATH, teams)
    write_json(HIGHLIGHTS_PATH, highlights)
    write_json(LEAGUE_STATS_PATH, league)
    return teams


def generate_schemes_best():
    group = ['gol', 'lat', 'zag', 'mei', 'ata', 'tec']
    schemes = read_json(SCHEMES_PATH)
    for filename in os.listdir(PLAYERS_FOLDER_PATH):
        round_path = os.path.join(PLAYERS_FOLDER_PATH, filename)
        players = read_json(round_path)['atletas']
        teams = []
        for scheme in schemes:
            team = {
                    'esquema': scheme,
                    'jogadores': [],
                    'pontuacao': 0,
                    'preco': 0,
                    'valorizacao': 0
            }
            for pos, qty in scheme['posicoes'].items():
                pos_index = group.index(pos) + 1
                team['jogadores'].extend(
                    sorted(
                        [player for player in players.values()
                         if player['posicao_id'] == pos_index],
                        key=itemgetter('pontos'),
                        reverse=True
                    )[:qty]
                )
            captain_index = -1
            captain_points = 0
            for i, player in enumerate(team['jogadores']):
                team['pontuacao'] += player['pontos']
                team['preco'] += player['preco_anterior']
                team['valorizacao'] += player['variacao']
                player['capitao'] = False
                if (player['pontos'] > captain_points and
                        player['posicao_id'] != 6):
                    captain_points = player['pontos']
                    captain_index = i
            team['jogadores'][captain_index]['capitao'] = True
            team['pontuacao'] += team['jogadores'][captain_index]['pontos']
            teams.append(team)
        schemes_path = round_path.replace('atletas', 'melhores-esquemas')
        write_json(schemes_path, teams)


def main():
    generate_teams_data()
    generate_schemes_best()


if __name__ == '__main__':
    main()
