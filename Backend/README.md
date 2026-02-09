# Backend

## Running the Backend

1. Install Python (3.12)
2. Navigate to the root `/` and create a venv there

```
python -m venv venv
```

3. Activate the venv (this will vary based on your OS e.g. Windows/ Linux, or your terminal e.g. Command Prompt, Powershell or Bash)

e.g. on Command Prompt on Windows

```
call venv/Scripts/activate.bat
```

4. Ensure you have a `.env` file in this folder (i.e. `/Backend/.env`) with the relevant variables
5. Install the dependencies

inside `/Backend` run

```
pip install -r requirements.txt
```

6. Install the backend as a module

inside `/Backend` run

```
pip install .
```

7. Ensure you have a `.env` file in this folder (i.e. `/Backend/.env`) with the relevant variables below

8. Run the Flask server

inside `/Backend` run

```
python -m flask --app app run --host=0.0.0.0
```

(Here, the `host` value specifies which URLs the backend can be accessed from. `0.0.0.0` allows anything.)

You can simply rename `.example` and fill in the values you need (and for any you're unsure about, leaving them as their defaults should suffice):

| Name           | Meaning                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| APP_SECRET     | A randomly generated (semi-)static key used by Flask. Doesn't matter what the value is, so generate it once and fill it in.                |
| GEMINI_API_KEY | An API key for Google Gemini. This can be gotten by signing up at https://aistudio.google.com/                                             |
| USE_REAL_MODEL | Whether to use the real model (Gemini) or the mock model (a static model that returns the same cached output on repeat). `True` or `False` |
