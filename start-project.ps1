# Start Carshop Project
Write-Host "🚗 Starting Carshop Project..." -ForegroundColor Green

# Start API server in background
Write-Host "🔧 Starting API server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api; npm run dev"

# Wait a moment
Start-Sleep -Seconds 3

# Start Frontend server in background
Write-Host "🎨 Starting Frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "📊 Health Check: http://localhost:3001/health" -ForegroundColor Cyan 