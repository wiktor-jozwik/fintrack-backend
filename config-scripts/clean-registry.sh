#!/bin/bash

declare -a microservices=("api" "currency-rates-importer" "operations-import-consumer")

REGISTRY=fintrackregistry

for microservice in "${microservices[@]}"
do
  REPOSITORY=fintrack-$microservice
  ACR_TAGS="$(az acr repository show-tags -n $REGISTRY --repository $REPOSITORY --output tsv --orderby time_desc)"

  TAGS=($ACR_TAGS)

  for tag in "${TAGS[@]:1}"; do
      az acr repository delete -n $REGISTRY --image $REPOSITORY:$tag -y
  done
done