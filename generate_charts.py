from operator import itemgetter

# local imports
from constants import HIGHLIGHTS_PATH, ROUNDS_PATH, TEAMS_PATH
from helpers import read_json, write_json


def rank(ls, key, teams):
    ls = sorted(ls, key=itemgetter(1), reverse=True)
    for i, (name, _) in enumerate(ls):
        teams[name][key].append(i+1)


def generate_teams_data():
    rounds = read_json(ROUNDS_PATH, [])
    teams = {}
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
                    'pior_valorização_da_rodada': 0
                }
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
    best = max(teams.values(), key=itemgetter('melhor_da_rodada'))
    worst = max(teams.values(), key=itemgetter('pior_da_rodada'))
    rich = max(teams.values(), key=itemgetter('maior_valorização_da_rodada'))
    poor = max(teams.values(), key=itemgetter('pior_valorização_da_rodada'))
    highlights = {
        'melhor_da_rodada': {
            'nome': best['nome'],
            'total': best['melhor_da_rodada']
        },
        'pior_da_rodada': {
            'nome': worst['nome'],
            'total': worst['pior_da_rodada']
        },
        'maior_valorização_da_rodada': {
            'nome': rich['nome'],
            'total': rich['maior_valorização_da_rodada']
        },
        'pior_valorização_da_rodada': {
            'nome': poor['nome'],
            'total': poor['pior_valorização_da_rodada']
        }
    }
    write_json(TEAMS_PATH, teams)
    write_json(HIGHLIGHTS_PATH, highlights)
    return teams


def main():
    generate_teams_data()


if __name__ == '__main__':
    main()
