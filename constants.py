import os

DATA_PATH = 'data'
DOCS_PATH = os.path.join('docs', 'data')
MARKET_PATH = os.path.join(DATA_PATH, 'mercado.json')
PLAYERS_MARKET_PATH = os.path.join(DATA_PATH, 'atletas_mercado.json')
LEAGUE_PATH = os.path.join(DATA_PATH, 'liga.json')
ROUNDS_PATH = os.path.join(DATA_PATH, 'rodadas.json')
PLAYERS_HISTORY_PATH = os.path.join(DATA_PATH, 'historico.json')
TEAMS_PATH = os.path.join(DOCS_PATH, 'times.json')
HIGHLIGHTS_PATH = os.path.join(DOCS_PATH, 'destaques.json')
LEAGUE_STATS_PATH = os.path.join(DOCS_PATH, 'liga.json')
SCHEMES_PATH = os.path.join(DOCS_PATH, 'esquemas.json')
SHIELDS_PATH = os.path.join(DOCS_PATH, 'escudos')
PLAYERS_FOLDER_PATH = os.path.join(DOCS_PATH, 'atletas')
PLAYERS_PATH = os.path.join(PLAYERS_FOLDER_PATH, 'rodada-x.json')

EMPTY_TEAM_SHIELD = 'https://cartolafc.globo.com/dist/6.11.1/img/emptystate_escudo.svg'  # noqa
