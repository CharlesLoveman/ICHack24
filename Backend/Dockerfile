FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./

# Installing python packages
RUN pip install --no-cache-dir -r requirements.txt

# Downloading gcloud package
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz

# Installing the package
RUN mkdir -p /usr/local/gcloud \
  && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
  && /usr/local/gcloud/google-cloud-sdk/install.sh

# Adding the package path to local
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

COPY Backend .

RUN chmod +x gcloud_test/run_test.sh

CMD [ ".", "./gcloud_test/run_test.sh" ]