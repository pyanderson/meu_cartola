# Meu Cartola

[Acesse Aqui](https://pyanderson.github.io/meu_cartola/)


## Dependências
- [Python 3.6+](https://www.python.org/downloads/)

## Configuração

```bash
$ pip install -r requirements.txt
```

## Download
Para baixar os dados da sua liga você precisa de duas informações:
- Token de autenticação.
- Tag GLB.

### Autenticação
#### Ferramenta de desenvolvedor
Na maioria dos navegadores basta apertar F12 para abrir a ferramenta de desenvolvedor, é aqui que você vai encontrar as informações que precisa.

#### Login
Faça login no Cartola FC.

#### Network
Clique na aba network e pesquise por "api.cartola" e escolha qualquer uma das requisições:

![Aba network da ferramenta de desenvolvedor](/images/passo1.png)


#### Headers
No painel que que vai aparecer selecione a aba "headers" e procure pelo header "Auhtorizartion", o valor após a palavra "Bearer" é o seu token:

![Header Authorization](/images/passo2.png)


Depois pesquise por "X-GLB-Tag" esse é o valor da sua tag GLB:


![Header X-GLB-Tag](/images/passo3.png)

### Executar
Você pode executar o script de download de duas formas, definindo o token e a tag como variáveis de ambiente ou passando esses valores como argumtentos opcionais do script:

```bash
$ export CARTOLA_TOKEN=TOKEN
$ export CARTOLA_GLB_TAG=GLB_TAG
$ python download.py "LAMPIÕENS CHAMPIONS LEAGUE"
```

```bash
$ python download.py "LAMPIÕENS CHAMPIONS LEAGUE" --token TOKEN --glb-tag GLB_TAG
```

## Gerar dados dos gráficos
Para os gráficos serem gerados corretamente é preciso que o script de download tenha sido executado pelo menos uma vez, pois é ele que gera os dados que serão usados nos gráficos:

```bash
$ python generate_charts.py
```
