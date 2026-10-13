$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
# Process-local TLS setting; certificate verification remains enabled.
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$version = 'v24.21.0'
$archiveName = "node-$version-win-x64.zip"
$baseUrl = "https://nodejs.org/dist/$version"
$tools = Join-Path (Split-Path $PSScriptRoot -Parent) '.tools'
$destination = Join-Path $tools 'node'
$staging = Join-Path $tools ('install-' + [Guid]::NewGuid().ToString('N'))

try {
    if ([Environment]::GetEnvironmentVariable('PROCESSOR_ARCHITECTURE') -ne 'AMD64' -and
        [Environment]::GetEnvironmentVariable('PROCESSOR_ARCHITEW6432') -ne 'AMD64') {
        throw 'This build supports x64 Windows. An x64 computer is required.'
    }
    if (Test-Path $destination) {
        throw 'The .tools\node folder is incomplete. Rename that folder, then retry.'
    }
    New-Item -ItemType Directory -Path $staging -Force | Out-Null
    $archive = Join-Path $staging $archiveName
    $checksums = Join-Path $staging 'SHASUMS256.txt'
    Write-Host "Downloading private Node.js $version from nodejs.org..."
    Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/SHASUMS256.txt" -OutFile $checksums
    Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/$archiveName" -OutFile $archive
    $pattern = '^([a-fA-F0-9]{64})\s+' + [Regex]::Escape($archiveName) + '$'
    $matchesFound = @(Get-Content $checksums | Where-Object { $_ -match $pattern })
    if ($matchesFound.Count -ne 1) { throw 'Official archive checksum could not be found.' }
    $expected = ($matchesFound[0] -split '\s+')[0]
    $actual = (Get-FileHash -Algorithm SHA256 -Path $archive).Hash
    if ($actual -ne $expected) { throw 'Node.js archive checksum failed. The archive will not be used.' }
    Write-Host 'Checksum verified. Extracting runtime...'
    Expand-Archive -LiteralPath $archive -DestinationPath $staging
    $extracted = Join-Path $staging "node-$version-win-x64"
    if (!(Test-Path (Join-Path $extracted 'node.exe')) -or !(Test-Path (Join-Path $extracted 'npm.cmd'))) {
        throw 'Downloaded runtime is incomplete.'
    }
    Move-Item -LiteralPath $extracted -Destination $destination
    Write-Host 'Private runtime ready. Your system Node.js and PATH have not been changed.'
} catch {
    Write-Host ('Setup failed: ' + $_.Exception.Message)
    Write-Host 'Allow HTTPS downloads from nodejs.org, then retry. No administrator privileges are needed.'
    exit 1
} finally {
    if (Test-Path $staging) { Remove-Item -LiteralPath $staging -Recurse -Force }
}
