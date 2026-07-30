$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'EKRS Enterprise AI.lnk')
$TargetScript = "C:\Users\Parth\Desktop\airlearn\start.bat"
$IconFile = "C:\Users\Parth\Desktop\airlearn\ekrs_v2.ico"

if (Test-Path $DesktopPath) {
    Remove-Item $DesktopPath -Force
}

$Shortcut = $WshShell.CreateShortcut($DesktopPath)
$Shortcut.TargetPath = $TargetScript
$Shortcut.WorkingDirectory = "C:\Users\Parth\Desktop\airlearn"
$Shortcut.IconLocation = "$IconFile,0"
$Shortcut.Description = "EKRS AI Enterprise Knowledge Retrieval & Governance System"
$Shortcut.Save()

# Force Windows Shell to refresh icon cache immediately
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Shell32 {
    [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
[Shell32]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)

Write-Host "Updated Desktop Shortcut with new ekrs_v2.ico icon at: $DesktopPath"
