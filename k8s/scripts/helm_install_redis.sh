#!/bin/bash

#
#  Run this script after createing PVC and PV, see storage.yaml
#

helm repo add bitnami https://charts.bitnami.com/bitnami

helm install sns-redis-rel  --namespace sns  -f config/helm-redis-installer-values.yaml  bitnami/redis

