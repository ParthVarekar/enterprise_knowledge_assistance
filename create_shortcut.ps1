$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'EKRS Enterprise AI.lnk')
$TargetScript = "C:\Users\Parth\Desktop\airlearn\start.bat"
$IconFile = "C:\Users\Parth\Desktop\airlearn\ekrs.ico"

$Shortcut = $WshShell.CreateShortcut($DesktopPath)
$Shortcut.TargetPath = $TargetScript
$Shortcut.WorkingDirectory = "C:\Users\Parth\Desktop\airlearn"
$Shortcut.IconLocation = "$IconFile,0"
$Shortcut.Description = "EKRS AI Enterprise Knowledge Retrieval & Governance System"
$Shortcut.Save()

Write-Host "Created Desktop Shortcut with ekrs.ico icon at: $DesktopPath"
