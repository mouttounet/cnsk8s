#!/bin/bash

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm install monitor-rel --namespace sns -f config/helm-prometheus-stack-installer-values.yaml  prometheus-community/kube-prometheus-stack

