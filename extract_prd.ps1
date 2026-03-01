$xml = [System.IO.File]::ReadAllText('C:\Users\Laptop Solutions\Downloads\Voyance\prd_extracted\word\document.xml')
$clean = [regex]::Replace($xml, '<[^>]+>', '')
$clean = $clean -replace '\s+', ' '
$clean.Trim() | Out-File 'C:\Users\Laptop Solutions\Downloads\Voyance\prd_text.txt' -Encoding UTF8
Write-Host "Done - PRD text extracted"
