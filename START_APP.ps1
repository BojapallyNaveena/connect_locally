Write-Host "Starting HyperLocal Connect..." -ForegroundColor Cyan

# Start Backend
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"c:\Users\HP\OneDrive\consistency\backend`" && node server.js" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend  
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"c:\Users\HP\OneDrive\consistency\frontend`" && npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "Done! Keep both black windows open." -ForegroundColor Yellow
