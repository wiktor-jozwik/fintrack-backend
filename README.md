<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).



## Migrate currencies
```bash
npm run migrate:currencies
```

## Import currency rates script

```bash
npm run import:currency-rates {currency_name} {start_date} {end_date}
```

## Kubernetes

### Login to docker and azure

```bash
az login

az aks get-credentials --resource-group FinTrack-rg --name fintrack-aks

docker login fintrackregistry.azurecr.io
```

### Build docker images and push them to Azure Repository
```bash
./deploy-scripts/build-and-push-docker-images.sh
```

### Verify connection to Azure AKS
```bash
kubectl get nodes -o wide
```

### Init kubernetes namespaces
```bash
kubectl apply -f k8s/01-namespaces.yaml
```

### Deploy kubeseal controller
```bash
./deploy-scripts/k8s/deploy-kubeseal.sh
```

### Fetch kubeseal public key:

```bash
kubectl port-forward service/sealed-secrets-controller -n kube-system 8081:8080

curl localhost:8081/v1/cert.pem > k8s/kubeseal-publickey.pem
```

### Fetch rmq credentials

```bash
kubectl get secret rmq-cluster-default-user -n rmq -o jsonpath='{.data.username}' | base64 --decode
kubectl get secret rmq-cluster-default-user -n rmq -o jsonpath='{.data.password}' | base64 --decode
```

### Set all needed credentials for each microservice in file 00-env-secret.yaml

### Generate sealed secrets using kubeseal and apply it
```bash
./deploy-scripts/k8s/generate-and-apply-sealed-secrets.sh
```

### Deploy RabbitMQ

```bash
./deploy-scripts/k8s/deploy-rmq.sh
```

### Deploy microservices
```bash
./deploy-scripts/k8s/deploy-microservices.sh
```