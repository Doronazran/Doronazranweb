# ============================================================================
# Periodic auto-sync loop (no admin required). Runs auto-sync.ps1 every 3
# minutes, forever. Launched at logon by a Startup-folder shortcut created by
# install-auto-sync.ps1.  Stop it via Task Manager (powershell process) or by
# deleting the Startup shortcut and logging off.
# ============================================================================
$Repo = "C:\Users\DoronAzran\OneDrive - Sk-Pharma Group\Desktop\Doron Agents (Momi)\landing"
$Sync = Join-Path $Repo "scripts\auto-sync.ps1"

while ($true) {
  try { powershell.exe -NoProfile -ExecutionPolicy Bypass -File $Sync } catch {}
  Start-Sleep -Seconds 180
}
