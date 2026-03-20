@echo off
setlocal
set ROOT=%~dp0

start "ALUON Backend" cmd /c "cd /d %ROOT%backend && set SERVER_PORT=3000 && mvnw.cmd spring-boot:run"
start "ALUON Frontend" cmd /c "cd /d %ROOT%frontend && npm run dev"

echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
endlocal
