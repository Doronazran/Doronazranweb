# ============================================================================
# Installs auto-sync so it runs automatically. Run ONCE.
#
#   Periodic (default): auto-sync every 3 minutes.
#     powershell -ExecutionPolicy Bypass -File install-auto-sync.ps1
#
#   Real-time: push seconds after each edit.
#     powershell -ExecutionPolicy Bypass -File install-auto-sync.ps1 -RealTime
#
# Tries a Windows Scheduled Task first (needs admin). If that is blocked, it
# falls back to a Startup-folder launcher (no admin) and starts it now.
#
# To remove:
#   Unregister-ScheduledTask -TaskName "DoronWebsite-AutoSync" -Confirm:$false  (if task)
#   Remove the shortcut from:  shell:startup                                     (if fallback)
#   ...then end the 'powershell' background process in Task Manager.
# ============================================================================
param([switch]$RealTime)

$Repo     = "C:\Users\DoronAzran\OneDrive - Sk-Pharma Group\Desktop\Doron Agents (Momi)\landing"
$TaskName = "DoronWebsite-AutoSync"
$loop     = Join-Path $Repo "scripts\sync-loop.ps1"       # periodic (3 min)
$watch    = Join-Path $Repo "scripts\watch-and-sync.ps1"  # real-time
$target   = if ($RealTime) { $watch } else { $loop }
$mode     = if ($RealTime) { "REAL-TIME" } else { "PERIODIC (every 3 min)" }
$psArgs   = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$target`""

function Install-StartupFallback {
  $startup = [Environment]::GetFolderPath('Startup')
  $lnk     = Join-Path $startup "DoronWebsite-AutoSync.lnk"
  $shell   = New-Object -ComObject WScript.Shell
  $sc      = $shell.CreateShortcut($lnk)
  $sc.TargetPath       = (Get-Command powershell.exe).Source
  $sc.Arguments        = $psArgs
  $sc.WorkingDirectory = $Repo
  $sc.WindowStyle      = 7   # minimized
  $sc.Save()
  Write-Host "Created Startup launcher: $lnk" -ForegroundColor Green
  # Start it now so it's active without waiting for the next logon.
  Start-Process powershell.exe -ArgumentList $psArgs -WindowStyle Hidden
  Write-Host "Started the $mode auto-sync in the background (runs now + at every logon)." -ForegroundColor Green
}

# 1) Try a Scheduled Task (survives reboots cleanly; needs admin).
try {
  $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
  $action   = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $psArgs
  $trigger  = New-ScheduledTaskTrigger -AtLogOn
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force -ErrorAction Stop | Out-Null
  Write-Host "Installed $mode auto-sync as a Scheduled Task (runs at logon)." -ForegroundColor Green
  Start-Process powershell.exe -ArgumentList $psArgs -WindowStyle Hidden   # start now too
}
catch {
  Write-Host "Scheduled Task blocked ($($_.Exception.Message.Split([Environment]::NewLine)[0])). Using no-admin Startup launcher instead." -ForegroundColor Yellow
  Install-StartupFallback
}

Write-Host "Done. Log: scripts\auto-sync.log"
