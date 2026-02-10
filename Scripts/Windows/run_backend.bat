REM Navigate to root
cd ../..

REM Activate the virtual environment
call venv/Scripts/activate.bat

REM Desc: Run the backend.

cd Backend/
python -m flask --app app run --host=0.0.0.0
cd ../Scripts/Windows
