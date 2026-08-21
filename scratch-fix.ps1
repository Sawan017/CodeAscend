$content = Get-Content src\lib\github-analyzer.ts -Raw
$open = ($content.ToCharArray() | Where-Object {$_ -eq '{'}).Count
$close = ($content.ToCharArray() | Where-Object {$_ -eq '}'}).Count
Write-Output "Open: $open"
Write-Output "Close: $close"
