#!/bin/bash
declare -a directories=("api" "currency-rates-importer" "operations-import-consumer")

for dir in "${directories[@]}"
do
  kubeseal < k8s/$dir/00-env-secret.yaml --scope strict --cert k8s/kubeseal-publickey.pem -o yaml > k8s/$dir/01-sealedsecret.yaml
  kubectl apply -f k8s/$dir/01-sealedsecret.yaml
done
