# Fix TypeScript environment variable access issues
Write-Host "🔧 Fixing TypeScript environment variable access..." -ForegroundColor Yellow

# Fix logger.ts
$loggerContent = Get-Content "api/src/utils/logger.ts" -Raw
$loggerContent = $loggerContent -replace 'process\.env\.LOG_LEVEL', 'process.env["LOG_LEVEL"]'
Set-Content "api/src/utils/logger.ts" $loggerContent

# Fix errorHandler.ts
$errorHandlerContent = Get-Content "api/src/middleware/errorHandler.ts" -Raw
$errorHandlerContent = $errorHandlerContent -replace 'process\.env\.NODE_ENV', 'process.env["NODE_ENV"]'
Set-Content "api/src/middleware/errorHandler.ts" $errorHandlerContent

# Fix authController.ts
$authControllerContent = Get-Content "api/src/controllers/authController.ts" -Raw
$authControllerContent = $authControllerContent -replace 'process\.env\.JWT_SECRET', 'process.env["JWT_SECRET"]'
$authControllerContent = $authControllerContent -replace 'process\.env\.NODE_ENV', 'process.env["NODE_ENV"]'
Set-Content "api/src/controllers/authController.ts" $authControllerContent

Write-Host "✅ TypeScript fixes applied!" -ForegroundColor Green 