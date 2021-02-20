#!/bin/bash

#
# Run static analyzer tool on K8s configuration yaml files.
#

docker run -i kubesec/kubesec:v2 scan /dev/stdin < payments.yaml
docker run -i kubesec/kubesec:v2 scan /dev/stdin < subscriptions.yaml
docker run -i kubesec/kubesec:v2 scan /dev/stdin < ingress-rules.yaml

