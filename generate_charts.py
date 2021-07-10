from operator import itemgetter

# local imports
from constants import ROUNDS_PATH, TEAMS_PATH
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
        for team in _round:
            name = team['time']['nome']
            points = team['pontos'] or 0
            try:
                teams[name]['total'] = teams[name]['total'] + points
                teams[name]['rodadas'].append(team['rodada_atual'])
                teams[name]['pontos'].append(teams[name]['total'])
                teams[name]['patrimonio'].append(team['patrimonio'])
            except KeyError:
                teams[name] = {
                    'total': points,
                    'rodadas': [team['rodada_atual']],
                    'pontos': [0, points],
                    'posicoes': [],
                    'patrimonio': [100, team['patrimonio']]
                }
            positions.append((name, teams[name]['total']))
        rank(positions, 'posicoes', teams)
    write_json(TEAMS_PATH, teams)
    return teams


def main():
    generate_teams_data()


if __name__ == '__main__':
    main()
