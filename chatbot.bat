@echo off
setlocal
title Gemini Chatbot Launcher

:: --- Read Port from .env file ---
echo Reading configuration from .env file...
set "APP_PORT="
for /f "usebackq tokens=1,2 delims==" %%a in (`findstr /B "PORT=" .env`) do (
    set "APP_PORT=%%b"
)

if not defined APP_PORT (
    echo ERROR: Could not find a 'PORT=' entry in the .env file.
    pause
    exit /b
)

echo Port configured to %APP_PORT%.
echo.

echo Starting the Gemini Chatbot server...
:: Start the node server in a separate window. This allows the current script to continue.
start "Gemini Chatbot Server" node index.js

echo.
echo Waiting for the server to become available on port %APP_PORT%...

:check_port
:: Use netstat to check if the port is in a LISTENING state.
:: The >nul redirects the command's output so it doesn't clutter the screen.
netstat -an | find ":%APP_PORT%" | find "LISTENING" >nul

:: Check the result of the 'find' command. If it's not 0, the port isn't ready.
if %ERRORLEVEL% neq 0 (
    timeout /t 1 /nobreak >nul
    goto check_port
)

echo Server is ready! Opening the application in your browser...
start "Gemini Chatbot" msedge --new-window "http://localhost:%APP_PORT%"

echo.
echo The launcher has finished. The server is running in a separate window.
pause