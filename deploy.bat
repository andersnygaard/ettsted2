@echo off
echo === Deploying to Azure ===
call az webapp deploy --name finans --resource-group finans-rg --src-path deploy\deploy.zip --type zip
if %ERRORLEVEL% neq 0 (
    echo Deployment failed
    exit /b 1
)
echo === Done ===
echo Deployed: https://finans.azurewebsites.net
