import json
import os


def read_json(path, default=None):
    if not os.path.exists(path):
        return default
    with open(path) as jfile:
        return json.load(jfile)


def write_json(path, data):
    folder, _ = os.path.split(path)
    if not os.path.exists(folder):
        os.makedirs(folder)
    with open(path, 'w') as jfile:
        json.dump(data, jfile, ensure_ascii=False)
