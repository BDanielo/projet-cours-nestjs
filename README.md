# QVEMA (Qui veut-être mon associé)

## Description

QVEMA est un projet réalisé dans le cadre d'un cours sur le framework [NestJS](https://nestjs.com). Ce projet vise à démontrer les concepts fondamentaux de NestJS tout en construisant une application serveur efficace et évolutive.

## Documentation API

Une fois le projet lancé, la documentation Swagger est accessible à l'URL suivante : [https://localhost:3000/api](https://localhost:3000/api)

## Clonage du dépôt

Pour cloner ce dépôt, exécutez la commande suivante :

```bash
$ git clone https://github.com/BDanielo/projet-cours-nestjs.git
```

## Installation

Pour installer les dépendances du projet, exécutez la commande suivante :

```bash
$ npm install
```

## Compilation et exécution du projet

### Mode développement

```bash
$ npm run start
```

### Mode watch (surveillance des modifications)

```bash
$ npm run start:dev
```

### Lancer la base de données MySQL

```bash
$ docker-compose up -d
```

### Mode production

```bash
$ npm run start:prod
```

## Tests

### Tests unitaires

```bash
$ npm run test
```

### Tests end-to-end (e2e)

```bash
$ npm run test:e2e
```

### Couverture des tests

```bash
$ npm run test:cov
```

## Déploiement

Pour déployer l'application NestJS en production, suivez les étapes décrites dans la [documentation officielle de déploiement](https://docs.nestjs.com/deployment).

Si vous recherchez une plateforme cloud pour déployer votre application NestJS, vous pouvez utiliser [Mau](https://mau.nestjs.com), la plateforme officielle pour déployer des applications NestJS sur AWS. Voici comment l'utiliser :

```bash
$ npm install -g mau
$ mau deploy
```

Avec Mau, le déploiement est rapide et simple, vous permettant de vous concentrer sur le développement des fonctionnalités.

## Ressources

Voici quelques ressources utiles pour travailler avec NestJS :

- [Documentation officielle de NestJS](https://docs.nestjs.com)
- [Canal Discord](https://discord.gg/G7Qnnhy) pour poser vos questions et obtenir du support
- [Cours vidéo officiels](https://courses.nestjs.com) pour approfondir vos connaissances
- [NestJS Devtools](https://devtools.nestjs.com) pour visualiser et interagir avec votre application en temps réel
- [Support entreprise](https://enterprise.nestjs.com) pour obtenir de l'aide sur vos projets
- [Jobs board officiel](https://jobs.nestjs.com) pour trouver ou proposer un emploi