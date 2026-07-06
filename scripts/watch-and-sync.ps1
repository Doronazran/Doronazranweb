# ============================================================================
# Real-time auto-sync: watches the website folder and pushes to GitHub a few
# seconds after you stop editing. Leave it running in a terminal (or start it
# at logon via install-auto-sync.ps1 -RealTime).
#   Run:  powershell -ExecutionPolicy Bypass -File watch-and-sync.ps1
#   Stop: Ctrl+C
# ============================================================================

$Repo     = "C:\Users\DoronAzran\OneDrive - Sk-Pharma Group\Desktop\Doron Agents (Momi)\landing"
$Watch    = $Repo
$Sync     = Join-Path $Repo "scripts\auto-sync.ps1"
$Marker   = Join-Path $env:TEMP "doron-lastchange.txt"
$Debounce = 15   # seconds of quiet before a commit+push

$fsw = New-Object System.IO.FileSystemWatcher
$fsw.Path = $Watch
$fsw.IncludeSubdirectories = $true
$fsw.NotifyFilter = [System.IO.NotifyFilters]::LastWrite
$fsw.EnableRaisingEvents = $true

# On any change, record the time (ignoring build/dependency folders).
$onChange = {
  $p = $Event.SourceEventArgs.FullPath
  if ($p -match '\\node_modules\\|\\dist\\|\\\.git\\') { return }
  (Get-Date).ToString('o') | Set-Content -Path $Event.MessageData
}
foreach ($evt in 'Changed','Created','Deleted','Renamed') {
  Register-ObjectEvent $fsw $evt -Action $onChange -MessageData $Marker | Out-Null
}

Write-Host "Watching '$Watch' for changes. Will auto-push $Debounce sec after you stop editing. (Ctrl+C to stop)" -ForegroundColor Cyan

while ($true) {
  Start-Sleep -Seconds 5
  if (Test-Path $Marker) {
    $last = [datetime]::Parse((Get-Content $Marker -Raw).Trim())
    if (((Get-Date) - $last).TotalSeconds -ge $Debounce) {
      Remove-Item $Marker -Force
      & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $Sync
    }
  }
}
