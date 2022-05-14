import argparse
import os
import unicodedata as ud

# third imports
import requests

# local imports
from constants import (DATA_PATH, LEAGUE_PATH, MARKET_PATH,
                       PLAYERS_HISTORY_PATH, PLAYERS_MARKET_PATH, PLAYERS_PATH,
                       ROUNDS_PATH, SHIELDS_PATH)
from helpers import read_json, write_json


def slugify(s):
    n = ''.join(c for c in ud.normalize('NFD', s) if ud.category(c) != 'Mn')
    return '-'.join(n.lower().split())


def download_team_shield(team):
    if not os.path.exists(SHIELDS_PATH):
        os.makedirs(SHIELDS_PATH)
    res = requests.get(team['time']['url_escudo_png'])
    image_path = os.path.join(SHIELDS_PATH, f'{team["time"]["nome"]}.png')
    with open(image_path, 'wb') as png:
        png.write(res.content)


def fetch(resource, glb_tag=None, token=None):
    url = f'https://api.cartola.globo.com/{resource}'
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',  # noqa
    }
    if glb_tag is not None:
        headers['X-GLB-APP'] = 'cartola_web'
        headers['X-GLB-Auth'] = 'oidc'
        headers['X-GLB-Tag'] = glb_tag
    if token is not None:
        headers['Authorization'] = f'Bearer {token}'
    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        raise Exception(f'failed to fetch {resource}: {res.text}')
    return res.json()


def get_round(_round, teams):
    return [
        fetch(f'time/id/{team["time_id"]}/{_round}') for team in teams
    ]


def download_league_data(league_slug, glb_tag, token):
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
    rounds = read_json(ROUNDS_PATH, [])
    market = fetch('mercado/status')
    league = fetch(f'auth/liga/{league_slug}', glb_tag, token)
    limit = 39 if market['game_over'] else market['rodada_atual']
    # only search the missing rounds
    for i in range(len(rounds) + 1, limit):
        rounds.append(get_round(i, league['times']))
    # download the shields
    for team in rounds[-1]:
        download_team_shield(team)
    # save the data
    write_json(MARKET_PATH, market)
    write_json(LEAGUE_PATH, league)
    write_json(ROUNDS_PATH, rounds)


def fetch_player(glb_tag, token, _id):
    return fetch(
        f'auth/mercado/atleta/{_id}/pontuacao',
        glb_tag,
        token
    )


def get_player_round(history, round_id):
    if history is None:
        return None
    for _round in history:
        if round_id == _round['rodada_id']:
            return _round
    return None


def download_clubs_data(glb_tag, token):
    players_market = fetch('atletas/mercado')
    write_json(PLAYERS_MARKET_PATH, players_market)


def download_players_history(glb_tag, token):
    market = fetch('mercado/status')
    players_history = read_json(PLAYERS_HISTORY_PATH, {})
    limit = 39 if market['game_over'] else market['rodada_atual']
    for i in range(1, limit):
        path = PLAYERS_PATH.replace('x', str(i))
        players = read_json(path)
        if players is None:
            try:
                players = fetch(f'atletas/pontuados/{i}')
            except Exception:
                continue
        for _id, player in players['atletas'].items():
            player_history = players_history.get(_id)
            _round = get_player_round(player_history, i)
            if _round is None or _round['preco'] is None:
                if i == market['rodada_atual'] - 1 or player_history is None:
                    players_history[_id] = fetch_player(glb_tag, token, _id)
                _round = get_player_round(players_history.get(_id), i)
                if _round is None or _round['preco'] is None:
                    continue
            _round['preco_anterior'] = (
                _round['preco'] + (_round['variacao'] * -1)
            )
            player.update(_round)
        write_json(path, players)
    write_json(PLAYERS_HISTORY_PATH, players_history)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Baixar dados de uma liga do Cartola FC'
    )
    parser.add_argument('name', help='Nome da Liga', type=slugify)
    parser.add_argument(
        '--token',
        default=os.environ.get('CARTOLA_TOKEN'),
        help='Token de autenticação'
    )
    parser.add_argument(
        '--glb-tag',
        default=os.environ.get('CARTOLA_GLB_TAG'),
        help='Tag GLB'
    )
    args = parser.parse_args()
    if args.token is None:
        raise SystemExit('é necessário um token de autenticação')
    if args.glb_tag is None:
        raise SystemExit('é necessário um valor para a tag GLB')
    download_league_data(args.name, args.glb_tag, args.token)
    download_clubs_data(args.glb_tag, args.token)
    download_players_history(args.glb_tag, args.token)
