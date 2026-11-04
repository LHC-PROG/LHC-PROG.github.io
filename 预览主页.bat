@echo off
cd /d "%~dp0"
powershell -NoProfile -Command "Start-Process node -ArgumentList 'preview.cjs' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
