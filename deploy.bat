@echo off
REM Deploy the package to Azure App Service
if not exist deploy.zip (
  echo Error: deploy.zip not found!
  echo Run package.bat first to create the deployment package.
  exit /b 1
)

echo Deploying to Azure...
call az webapp deploy --name finans --resource-group finans-rg --src-path deploy.zip --type zip

if %errorlevel% equ 0 (
  echo.
  echo Deployment successful!
  echo.
  echo App URL: https://finans.azurewebsites.net
  echo Login: https://finans.azurewebsites.net/.auth/login/google
) else (
  echo.
  echo Deployment failed!
  exit /b 1
)
