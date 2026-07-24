$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

function Test-Port($port) {
  $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
  return $null -ne $connection
}

Write-Host "Starting Hollow Fall..." -ForegroundColor Cyan

if (Test-Port 8000) {
  Write-Host "Chatbot backend already running on http://127.0.0.1:8000" -ForegroundColor Yellow
} else {
  Write-Host "Starting chatbot backend on http://127.0.0.1:8000" -ForegroundColor Green
  Start-Process -FilePath "python" `
    -ArgumentList "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000" `
    -WorkingDirectory $backend `
    -WindowStyle Hidden
  Start-Sleep -Seconds 3
}

Write-Host "Opening website at http://127.0.0.1:5173" -ForegroundColor Green
Start-Process "http://127.0.0.1:5173"

Set-Location $frontend
npm run dev -- --host 127.0.0.1 --port 5173
