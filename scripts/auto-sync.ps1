# ============================================================================
# Auto-sync the Doron website to GitHub (repo: Doronazran/Doronazranweb).
# Commits any changes and pushes to origin/main. Safe to run repeatedly --
# does nothing when there are no changes.
# ============================================================================

# This 'landing' folder IS the git repo that deploys to Vercel.
$Repo    = "C:\Users\DoronAzran\OneDrive - Sk-Pharma Group\Desktop\Doron Agents (Momi)\landing"
$LogFile = Join-Path $Repo "scripts\auto-sync.log"   # *.log is gitignored

function Log($msg) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg"
  Write-Host $line
  try { Add-Content -Path $LogFile -Value $line } catch {}
}

Set-Location $Repo

# 1) Make sure a real GitHub remote is configured.
$remote = (git remote get-url origin 2>$null)
if (-not $remote -or $remote -match 'YOUR_USERNAME') {
  Log "SKIP: GitHub remote not configured (origin = '$remote')."
  exit 0
}

# 2) Anything to sync?
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
  Log "No changes - already up to date."
  exit 0
}

# 3) Stage + commit.
Log "Changes detected - committing."
git add -A
$msg = "Auto update website - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $msg | Out-Null

# 4) Bring in remote changes (rebase) so the push can't be rejected.
git pull --rebase origin main
if ($LASTEXITCODE -ne 0) {
  Log "WARNING: 'git pull --rebase' failed (possible conflict). Resolve manually, then re-run."
  exit 1
}

# 5) Push (triggers the Vercel deploy).
git push origin main
if ($LASTEXITCODE -ne 0) {
  Log "ERROR: push failed. Check your GitHub credentials / network."
  exit 1
}

Log "Pushed successfully: $msg"
