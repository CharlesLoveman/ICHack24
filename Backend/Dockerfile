FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./

# Installing python packages
RUN pip install --no-cache-dir -r requirements.txt

# Downloading gcloud package
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz

COPY Backend .

CMD [ "python", "-m", "flask", "--app", "app", "run" ]