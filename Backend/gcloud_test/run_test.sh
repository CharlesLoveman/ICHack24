#!/bin/bash

# Login to gcloud
echo $GCLOUD_KEY > key_file.json
gcloud auth activate-service-account mongod@crucial-bucksaw-413121.iam.gserviceaccount.com --key-file=key_file.json
rm key_file.json

# Run tests
python gcloud_test/test_mongo.py
python gcloud_test/test_gemini.py
