FROM python:3.12

WORKDIR /usr/src/app

COPY requirements.txt ./

# Installing python packages
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "-m", "flask", "--app", "app", "run" ]