@echo off
REM Build and package the React app for Azure deployment
echo Building application...
call npm run build
if %errorlevel% neq 0 (
  echo Build failed!
  exit /b 1
)

echo.
echo Creating deployment package...
cd dist
tar -acf ../deploy.zip *
cd ..

if exist deploy.zip (
  echo.
  echo Package created successfully: deploy.zip
  echo.
  echo Next step: run deploy.bat to deploy to Azure
) else (
  echo.
  echo Failed to create deployment package!
  exit /b 1
)
