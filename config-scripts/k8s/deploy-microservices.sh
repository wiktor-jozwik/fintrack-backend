#!/bin/bash
declare -a microservices=("api" "currency-rates-importer" "operations-import-consumer")

for microservice in "${microservices[@]}"
do
  kubectl apply -f k8s/$microservice/02-deployment.yaml
done
