@echo off
echo Iniciando servidores do Hub Maximiza...

echo.
echo 1. Iniciando Backend (porta 5000)...
start "Backend API" cmd /k "cd backend && npm run dev"

echo.
echo Aguardando backend inicializar...
timeout /t 5 /nobreak > nul

echo.
echo 2. Testando conectividade do backend...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method GET | Out-Host; Write-Host 'Backend funcionando!' -ForegroundColor Green } catch { Write-Host 'Backend nao esta respondendo!' -ForegroundColor Red }"

echo.
echo 3. Iniciando Frontend (porta 3000)...
start "Frontend React" cmd /k "npm start"

echo.
echo Servidores iniciados!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
