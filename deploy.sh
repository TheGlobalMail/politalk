#!/bin/bash

if [ ! $# == 1 ]; then
  echo "Usage: $0 {staging,production}"
  exit
fi

target="$1"

if [ $target == "staging" ] ; then
  echo "Deploying to http://politalk-staging.theglobalmail.org"
  grunt build:staging
  s3cmd sync -P dist/ s3://politalk-staging.theglobalmail.org
fi
if [ $target == "production" ] ; then
  echo "Deploying to http://politalk.theglobalmail.org"
  grunt build
  s3cmd sync -P dist/ s3://politalk.theglobalmail.org
fi

grunt clean:dist
