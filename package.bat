@echo off
echo === Building React App ===
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed
    exit /b 1
)

echo === Creating package.json for deployment ===
(
echo {
echo   "name": "finans-app",
echo   "version": "1.0.0",
echo   "type": "module",
echo   "main": "server.js",
echo   "scripts": {
echo     "start": "node server.js"
echo   }
echo }
) > dist\package.json

echo === Copying server.js ===
copy server.js dist\server.js

echo === Creating deploy.zip ===
if not exist deploy mkdir deploy
if exist deploy\deploy.zip del deploy\deploy.zip
cd dist
tar -acf ..\deploy\deploy.zip *
cd ..

echo === Done ===
echo Package created: deploy\deploy.zip
