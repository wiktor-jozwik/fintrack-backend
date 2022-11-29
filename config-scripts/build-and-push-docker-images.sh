#!/bin/bash
AZURE_REGISTRY="fintrackregistry.azurecr.io"
docker login $AZURE_REGISTRY

declare -a microservices=("api" "currency-rates-importer" "operations-import-consumer")

for microservice in "${microservices[@]}"
do
  docker build -t $AZURE_REGISTRY/fintrack-$microservice:latest -f ./apps/$microservice/Dockerfile --target=prod .
  docker push $AZURE_REGISTRY/fintrack-$microservice:latest
done
