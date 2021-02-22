#!/bin/bash

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm install redis-export-rel --namespace sns -f config/redis-export-values.yaml  prometheus-community/prometheus-redis-exporter

