# Database Setup Script for Carshop Project
# This script helps configure the database environment

Write-Host "🚗 Carshop Database Setup" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Check if .env file exists in api directory
$envFile = postgresql://postgres:[Pranav@05]@db.mjewvzujpljuqutsfhgn.supabase.co:5432/postgres
if (Test-Path $envFile) {
    Write-Host "✅ Environment file already exists at $envFile" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled. Existing .env file preserved." -ForegroundColor Yellow
        exit
    }
}

# Copy environment example file
if (Test-Path "api\env.example") {
    Copy-Item "api\env.example" $envFile -Force
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
} else {
    Write-Host "❌ env.example file not found in api directory" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Database Configuration Options:" -ForegroundColor Cyan
Write-Host "1. Local PostgreSQL (requires installation)" -ForegroundColor White
Write-Host "2. Cloud PostgreSQL (Supabase/Neon - recommended)" -ForegroundColor White
Write-Host "3. Manual configuration" -ForegroundColor White

$choice = Read-Host "`nSelect option (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n🏠 Local PostgreSQL Setup" -ForegroundColor Cyan
        Write-Host "Make sure PostgreSQL is installed and running." -ForegroundColor Yellow
        
        $username = Read-Host "Enter PostgreSQL username (default: postgres)" 
        if ([string]::IsNullOrEmpty($username)) { $username = "postgres" }
        
        $password = Read-Host "Enter PostgreSQL password" -AsSecureString
        $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        $database = Read-Host "Enter database name (default: carshop_db)"
        if ([string]::IsNullOrEmpty($database)) { $database = "carshop_db" }
        
        $host = Read-Host "Enter host (default: localhost)"
        if ([string]::IsNullOrEmpty($host)) { $host = "localhost" }
        
        $port = Read-Host "Enter port (default: 5432)"
        if ([string]::IsNullOrEmpty($port)) { $port = "5432" }
        
        $connectionString = "postgresql://$username`:$passwordPlain@$host`:$port/$database"
    }
    "2" {
        Write-Host "`n☁️  Cloud PostgreSQL Setup" -ForegroundColor Cyan
        Write-Host "Please get your connection string from:" -ForegroundColor Yellow
        Write-Host "- Supabase: https://supabase.com" -ForegroundColor Blue
        Write-Host "- Neon: https://neon.tech" -ForegroundColor Blue
        
        $connectionString = Read-Host "`nPaste your connection string here"
    }
    "3" {
        Write-Host "`n✏️  Manual Configuration" -ForegroundColor Cyan
        $connectionString = Read-Host "Enter your complete DATABASE_URL"
    }
    default {
        Write-Host "❌ Invalid option selected" -ForegroundColor Red
        exit 1
    }
}

# Update the .env file
$envContent = Get-Content $envFile
$updatedContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$connectionString`""
Set-Content $envFile $updatedContent

Write-Host "`n✅ Database URL updated in .env file" -ForegroundColor Green

# Generate JWT secret if not already set
$jwtSecret = [System.Web.Security.Membership]::GeneratePassword(32, 10)
$updatedContent = $updatedContent -replace 'JWT_SECRET=".*"', "JWT_SECRET=`"$jwtSecret`""
Set-Content $envFile $updatedContent

Write-Host "✅ JWT secret generated and updated" -ForegroundColor Green

Write-Host "`n🎉 Environment setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. cd api" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npx prisma generate" -ForegroundColor White
Write-Host "4. npx prisma migrate dev --name init" -ForegroundColor White
Write-Host "5. npm run dev" -ForegroundColor White

Write-Host "`n📖 For detailed instructions, see: docs/DATABASE_SETUP.md" -ForegroundColor Blue 