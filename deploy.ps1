# JAIME'S BIRTHDAY SITE - AUTOMATED DEPLOYMENT SCRIPT
# This script will deploy your birthday site to GitHub Pages automatically!

Write-Host "JAIME'S BIRTHDAY DEPLOYMENT SCRIPT" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
Write-Host "ERROR: Git is not installed! Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if gh CLI is installed (optional but helpful)
$hasGhCli = Get-Command gh -ErrorAction SilentlyContinue

# Get GitHub username
$githubUsername = Read-Host "Enter your GitHub username"
$repoName = "jaime-birthday-3d"

Write-Host "`nDeployment Information:" -ForegroundColor Yellow
Write-Host "   GitHub Username: $githubUsername" -ForegroundColor Cyan
Write-Host "   Repository Name: $repoName" -ForegroundColor Cyan
Write-Host "   Live URL will be: https://$githubUsername.github.io/$repoName" -ForegroundColor Green

$confirm = Read-Host "`nDo you want to continue? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Configure git if needed
Write-Host "`nConfiguring Git..." -ForegroundColor Yellow
git config user.name "$githubUsername" 2>$null
$email = Read-Host "Enter your email for Git commits"
git config user.email "$email" 2>$null

# Add all files to git
Write-Host "`nPreparing files for deployment..." -ForegroundColor Yellow
git add -A
git commit -m "Deploy Jaime's Birthday Site" 2>$null

# Create or connect to GitHub repo
Write-Host "`nSetting up GitHub repository..." -ForegroundColor Yellow

if ($hasGhCli) {
    Write-Host "GitHub CLI detected! Using automated setup..." -ForegroundColor Green
    
    # Check if logged in
    $ghAuth = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Please login to GitHub:" -ForegroundColor Yellow
        gh auth login
    }
    
    # Create repo if it doesn't exist
    Write-Host "Creating repository on GitHub..." -ForegroundColor Yellow
    gh repo create $repoName --public --source=. --remote=origin --push 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Repository created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Repository might already exist, trying to push..." -ForegroundColor Yellow
        git remote add origin "https://github.com/$githubUsername/$repoName.git" 2>$null
        git push -u origin main 2>$null
        if ($LASTEXITCODE -ne 0) {
            git push -u origin master 2>$null
        }
    }
} else {
    Write-Host "Manual setup required:" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Create a new repository called: $repoName" -ForegroundColor Cyan
    Write-Host "3. Make it PUBLIC (important for GitHub Pages)" -ForegroundColor Cyan
    Write-Host "4. DON'T initialize with README" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter when you've created the repository"
    
    # Add remote and push
    git remote add origin "https://github.com/$githubUsername/$repoName.git" 2>$null
    git branch -M main 2>$null
    git push -u origin main 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Trying with master branch..." -ForegroundColor Yellow
        git branch -M master
        git push -u origin master
    }
}

# Enable GitHub Pages
Write-Host "`nEnabling GitHub Pages..." -ForegroundColor Yellow

if ($hasGhCli) {
    # Try to enable Pages via CLI
    Write-Host "Setting up GitHub Pages automatically..." -ForegroundColor Green
    
    # Create gh-pages branch
    git checkout -b gh-pages 2>$null
    git push origin gh-pages 2>$null
    git checkout main 2>$null
    
    Write-Host "SUCCESS: GitHub Pages branch created!" -ForegroundColor Green
} else {
    Write-Host "Manual GitHub Pages setup required:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$githubUsername/$repoName/settings/pages" -ForegroundColor Cyan
    Write-Host "2. Under 'Source', select 'Deploy from a branch'" -ForegroundColor Cyan
    Write-Host "3. Select 'main' (or 'master') branch" -ForegroundColor Cyan
    Write-Host "4. Select '/ (root)' folder" -ForegroundColor Cyan
    Write-Host "5. Click 'Save'" -ForegroundColor Cyan
}

Write-Host "`nDEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your site will be live at:" -ForegroundColor Yellow
Write-Host "   https://${githubUsername}.github.io/${repoName}" -ForegroundColor Green
Write-Host ""
Write-Host "Note: It may take 5-10 minutes for the site to go live" -ForegroundColor Yellow
Write-Host "You can check deployment status at:" -ForegroundColor Yellow
Write-Host "   https://github.com/${githubUsername}/${repoName}/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy Birthday Jaime!" -ForegroundColor Magenta
