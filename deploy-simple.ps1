# Simple Deployment Script for Jaime's Birthday Site
# This version has no special characters and maximum compatibility

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " JAIME'S BIRTHDAY SITE DEPLOYMENT" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check for Git
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Get user information
Write-Host ""
Write-Host "Please provide your GitHub information:" -ForegroundColor Yellow
Write-Host ""

$username = Read-Host "GitHub username"
$email = Read-Host "Email address"
$repoName = "jaime-birthday-3d"

# Display configuration
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Username: $username" -ForegroundColor Cyan
Write-Host "  Email: $email" -ForegroundColor Cyan  
Write-Host "  Repository: $repoName" -ForegroundColor Cyan
Write-Host "  Future URL: https://$username.github.io/$repoName" -ForegroundColor Green
Write-Host ""

$continue = Read-Host "Continue? (y/n)"
if ($continue -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Configure Git
Write-Host ""
Write-Host "Configuring Git..." -ForegroundColor Yellow
git config user.name "$username"
git config user.email "$email"
Write-Host "Git configured!" -ForegroundColor Green

# Initialize repository if needed
if (!(Test-Path ".git")) {
    Write-Host ""
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "Repository initialized!" -ForegroundColor Green
}

# Add and commit files
Write-Host ""
Write-Host "Preparing files..." -ForegroundColor Yellow
git add -A
git commit -m "Deploy birthday site for Jaime"
Write-Host "Files prepared!" -ForegroundColor Green

# Set up remote repository
Write-Host ""
Write-Host "Setting up GitHub repository..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: You need to create a repository on GitHub" -ForegroundColor Red
Write-Host ""
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: $repoName" -ForegroundColor Cyan
Write-Host "3. Make it PUBLIC" -ForegroundColor Cyan
Write-Host "4. DO NOT initialize with README" -ForegroundColor Cyan
Write-Host "5. Click 'Create repository'" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter after creating the repository"

# Add remote origin
$repoUrl = "https://github.com/$username/$repoName.git"
Write-Host ""
Write-Host "Connecting to GitHub..." -ForegroundColor Yellow

# Remove existing remote if present
git remote remove origin 2>$null

# Add new remote
git remote add origin $repoUrl
Write-Host "Remote added: $repoUrl" -ForegroundColor Green

# Try to push to main branch first
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Trying master branch..." -ForegroundColor Yellow
    git branch -M master
    git push -u origin master
}

Write-Host ""
Write-Host "Code pushed to GitHub!" -ForegroundColor Green

# Instructions for GitHub Pages
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " FINAL STEP: Enable GitHub Pages" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://github.com/$username/$repoName/settings/pages" -ForegroundColor Cyan
Write-Host "2. Under 'Source', select 'Deploy from a branch'" -ForegroundColor Cyan
Write-Host "3. Branch: main (or master)" -ForegroundColor Cyan
Write-Host "4. Folder: / (root)" -ForegroundColor Cyan
Write-Host "5. Click Save" -ForegroundColor Cyan
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host " DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your site will be live at:" -ForegroundColor Yellow
Write-Host "https://$username.github.io/$repoName" -ForegroundColor Green
Write-Host ""
Write-Host "Note: It takes 5-10 minutes to go live" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy Birthday Jaime!" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
