# ============================================================================
# Installs auto-sync as a Windows Scheduled Task. Run ONCE.
#
#   Periodic (default): commits + pushes every 3 minutes and at logon.
#     powershell -ExecutionPolicy Bypass -File install-auto-sync.ps1
#
#   Real-time: launches the file-watcher at logon (pushes seconds after edits).
#     powershell -ExecutionPolicy Bypass -File install-auto-sync.ps1 -RealTime
#
# To remove:  Unregister-ScheduledTask -TaskName "DoronWebsite-AutoSync" -Confirm:$false
# ============================================================================
param([switch]$RealTime)

$Repo     = "C:\Users\DoronAzran\OneDrive - Sk-Pharma Group\Desktop\Doron Agents (Momi)\landing"
$TaskName = "DoronWebsite-AutoSync"
$sync     = Join-Path $Repo "scripts\auto-sync.ps1"
$watch    = Join-Path $Repo "scripts\watch-and-sync.ps1"

$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

if ($RealTime) {
  $action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$watch`""
  $trigger = New-ScheduledTaskTrigger -AtLogOn
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
  Write-Host "Installed REAL-TIME auto-sync (file-watcher runs at logon)." -ForegroundColor Green
}
else {
  $action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$sync`""
  $atLogon = New-ScheduledTaskTrigger -AtLogOn
  $every3  = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 3) -RepetitionDuration (New-TimeSpan -Days 3650)
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $atLogon,$every3 -Settings $settings -Force | Out-Null
  Write-Host "Installed PERIODIC auto-sync (commits + pushes every 3 minutes)." -ForegroundColor Green
}

Write-Host "Task '$TaskName' is active. Log: scripts\auto-sync.log"
