FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./

# Installing python packages
RUN pip install --no-cache-dir -r requirements.txt

# Downloading gcloud installer
RUN curl curl https://sdk.cloud.google.com > install.sh

# Installing the package
RUN bash install.sh --disable-prompts

COPY Backend .

CMD [ "python", "-m", "flask", "--app", "app", "run" ]