@echo off
set "chrome64=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "chrome32=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

if exist "%chrome64%" (
    start "" "%chrome64%" http://localhost:5173/
) else if exist "%chrome32%" (
    start "" "%chrome32%" http://localhost:5173/
) else (
    echo No se encontró Google Chrome en las rutas estándar.
)

npm run dev