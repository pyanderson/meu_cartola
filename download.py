import argparse
import os
import unicodedata as ud

# third imports
import requests

# local imports
from constants import (DATA_PATH, LEAGUE_PATH, MARKET_PATH, ROUNDS_PATH,
                       SHIELDS_PATH)
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


def fetch(resource, glb_tag, token=None):
    url = f'https://api.cartolafc.globo.com/{resource}'
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',  # noqa
        'X-GLB-APP': 'cartola_web',
        'X-GLB-Auth': 'oidc',
        'X-GLB-Tag': glb_tag
    }
    if token is not None:
        headers['Authorization'] = f'Bearer {token}'
    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        raise Exception(f'failed to fetch {resource}: {res.text}')
    return res.json()


def get_round(_round, teams, glb_tag):
    return [
        fetch(f'time/id/{team["time_id"]}/{_round}', glb_tag) for team in teams
    ]


def download_league_data(league_slug, glb_tag, token):
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
    rounds = read_json(ROUNDS_PATH, [])
    market = fetch('mercado/status', glb_tag, token)
    league = fetch(f'auth/liga/{league_slug}', glb_tag, token)
    # only search the missing rounds
    for i in range(len(rounds) + 1, market['rodada_atual']):
        rounds.append(get_round(i, league['times'], glb_tag))
    # download the shields
    for team in rounds[-1]:
        download_team_shield(team)
    # save the data
    write_json(MARKET_PATH, market)
    write_json(LEAGUE_PATH, league)
    write_json(ROUNDS_PATH, rounds)


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
