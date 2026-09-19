@echo off
setlocal
set "ROOT_DIR=%~dp0"

start "Harlow Backend" cmd /k "cd /d ""%ROOT_DIR%backend"" && mvnw.cmd spring-boot:run"
start "Harlow Frontend" cmd /k "cd /d ""%ROOT_DIR%frontend"" && npm run dev"

endlocal
