@echo off
title Gemini Chatbot Launcher

echo Starting the Gemini Chatbot server...
:: Start the node server in a separate window. This allows the current script to continue.
start "Gemini Chatbot Server" node index.js

echo.
echo Waiting for the server to become available on port 8888...

:check_port
:: Use netstat to check if the port is in a LISTENING state.
:: The >nul redirects the command's output so it doesn't clutter the screen.
netstat -an | find ":8888" | find "LISTENING" >nul

:: Check the result of the 'find' command. If it's not 0, the port isn't ready.
if %ERRORLEVEL% neq 0 (
    timeout /t 1 /nobreak >nul
    goto check_port
)

echo Server is ready! Opening the application in your browser...
:: Launch the browser in a new window. This assumes a Chromium-based browser (Chrome, Edge) is in the system PATH.
:: For Firefox, you might use: start "Gemini Chatbot" firefox -new-window "http://localhost:8888"
start "Gemini Chatbot" msedge --new-window "http://localhost:8888"

echo.
echo The launcher has finished. The server is running in a separate window.
pause