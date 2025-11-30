@echo off
setlocal

set "EMULATOR_EXE=C:\Program Files\Azure Cosmos DB Emulator\Microsoft.Azure.Cosmos.Emulator.exe"

echo CosmosDB Emulator
echo =================
echo.

REM Check if emulator is installed
if not exist "%EMULATOR_EXE%" (
    echo ERROR: CosmosDB Emulator not installed.
    echo.
    echo Download: https://aka.ms/cosmosdb-emulator
    exit /b 1
)

REM Check if already running
tasklist /FI "IMAGENAME eq Microsoft.Azure.Cosmos.Emulator.exe" 2>NUL | find /I "Microsoft.Azure.Cosmos.Emulator.exe" >NUL
if not errorlevel 1 (
    echo Emulator already running.
    echo.
    echo Endpoint: https://localhost:8081
    echo Explorer: https://localhost:8081/_explorer/index.html
    exit /b 0
)

REM Start emulator
echo Starting emulator...
start "" "%EMULATOR_EXE%"

echo.
echo Endpoint: https://localhost:8081
echo Key:      C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
echo Explorer: https://localhost:8081/_explorer/index.html
echo.
echo Emulator starting... wait ~30s for endpoint to be ready.
