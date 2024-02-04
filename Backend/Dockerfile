FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN echo $(python -v)
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "-m", "flask", "--app", "app", "run" ]