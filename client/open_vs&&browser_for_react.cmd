@echo off

start code .
start npm run dev
timeout /t 2 >nul
start "" "http://localhost:5173"

exit
