#!/usr/bin/env sh

# listen on all hosts, presumably the docker image's
# ingress will be controlled by the docker config
npm run start -- --host 0.0.0.0
