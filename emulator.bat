@echo off
echo Starting CosmosDB Emulator...
echo.
echo This will start the Azure CosmosDB Emulator locally.
echo Endpoint: https://localhost:8081
echo.

REM Check if CosmosDB Emulator is installed
where /q Microsoft.Azure.Cosmos.Emulator
if errorlevel 1 (
    echo ERROR: CosmosDB Emulator is not installed.
    echo.
    echo Please install it from:
    echo https://docs.microsoft.com/azure/cosmos-db/local-emulator
    echo.
    echo Or download directly:
    echo https://aka.ms/cosmosdb-emulator
    echo.
    pause
    exit /b 1
)

REM Start the emulator
echo Starting emulator...
start "" "C:\Program Files\Azure Cosmos DB Emulator\Microsoft.Azure.Cosmos.Emulator.exe"

echo.
echo CosmosDB Emulator is starting...
echo.
echo The emulator UI will open in your browser at:
echo https://localhost:8081/_explorer/index.html
echo.
echo Connection details:
echo   Endpoint: https://localhost:8081
echo   Primary Key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
echo.
echo Press any key to exit this window...
pause >nul
