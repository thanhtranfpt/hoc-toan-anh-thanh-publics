import yaml
import json


class Configs:
    def __init__(self) -> None:
        self.configs = {}

        self.load_configs()
        self.load_env_configs()

    def load_configs(self):
        with open('config/configs.yaml', 'r', encoding='UTF-8') as file:
            cfgs = yaml.safe_load(file)

        self.configs = cfgs

    def load_env_configs(self):
        with open(self.configs['envs']['file_path'], 'r', encoding='UTF-8') as file:
            envs = json.load(file)

        self.configs['envs']['configs'] = envs[self.configs['envs']['selected']]




cfg = Configs()