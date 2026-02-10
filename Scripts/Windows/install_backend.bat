REM Desc: Creates a Python environment and install the necessary requirements.

REM Create a virtual environment
cd ../..
python -m venv venv

REM Activate the virtual environment
call venv/Scripts/activate.bat

cd Backend

REM Install the necessary requirements
pip install -r requirements.txt

REM Install the backend
pip install .

cd ..
cd Scripts/Windows
