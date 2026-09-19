@echo off
setlocal
set "ROOT_DIR=%~dp0"

if not defined JAVA_HOME (
	for /f "delims=" %%J in ('where java 2^>nul') do if not defined JAVA_HOME set "JAVA_HOME=%%~dpJ.."
)
if not defined JAVA_HOME (
	for %%J in ("%ProgramFiles%\Java\jdk*" "%ProgramFiles%\Eclipse Adoptium\jdk*") do if exist "%%~fJ\bin\java.exe" if not defined JAVA_HOME set "JAVA_HOME=%%~fJ"
)
if not defined JAVA_HOME (
	echo Java JDK 17+ was not found. Install a JDK or set JAVA_HOME.
	pause
	exit /b 1
)
if not exist "%JAVA_HOME%\bin\java.exe" (
	echo JAVA_HOME is invalid: %JAVA_HOME%
	pause
	exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
	echo npm was not found. Install Node.js or add it to PATH.
	pause
	exit /b 1
)

start "Harlow Backend" cmd /k "cd /d ""%ROOT_DIR%backend"" && mvnw.cmd spring-boot:run"
start "Harlow Frontend" cmd /k "cd /d ""%ROOT_DIR%frontend"" && npm run dev"

endlocal
