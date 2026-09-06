Add-Type -AssemblyName System.Drawing
$src = "C:\Users\oskar\Downloads\KontorKlar.png"
$dst = "C:\Users\oskar\Prosjekter\kontorklar\bilder"

$orig = New-Object System.Drawing.Bitmap $src

# --- Klipp ut et omraade som 32bpp med alfa ---
function Klipp($x,$y,$w,$h) {
  $ut = New-Object System.Drawing.Bitmap $w,$h,([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($ut)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($orig, (New-Object System.Drawing.Rectangle 0,0,$w,$h), (New-Object System.Drawing.Rectangle $x,$y,$w,$h), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  return $ut
}

# --- Gjor naer-hvitt gjennomsiktig. $hvit=$true maler alt blekk hvitt (revers-logo) ---
function Nokkel($bmp, $hvit) {
  $r = New-Object System.Drawing.Rectangle 0,0,$bmp.Width,$bmp.Height
  $d = $bmp.LockBits($r, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $n = $bmp.Width * $bmp.Height * 4
  $buf = New-Object byte[] $n
  [System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $buf, 0, $n)
  for ($i = 0; $i -lt $n; $i += 4) {
    $bl = $buf[$i]; $gr = $buf[$i+1]; $rd = $buf[$i+2]
    $maks = [Math]::Max($rd, [Math]::Max($gr, $bl))
    if ($maks -ge 250)     { $a = 0 }
    elseif ($maks -le 205) { $a = 255 }
    else                   { $a = [int](255 * (250 - $maks) / 45) }
    if ($hvit -and $a -gt 0) { $buf[$i] = 255; $buf[$i+1] = 255; $buf[$i+2] = 255 }
    $buf[$i+3] = $a
  }
  [System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $d.Scan0, $n)
  $bmp.UnlockBits($d)
}

# --- Skaler ---
function Skaler($bmp,$w,$h) {
  $ut = New-Object System.Drawing.Bitmap $w,$h,([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($ut)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle 0,0,$w,$h))
  $g.Dispose()
  return $ut
}

# Utsnitt funnet ved skanning, med litt luft
$merkeRaa   = Klipp 508 45 477 422     # sirkel + K + sjekk + blad
$ordRaa     = Klipp 372 473 803 130    # "KontorKlar"

foreach ($variant in @(@($false,"logo.png"), @($true,"logo-lys.png"))) {
  $hvit = $variant[0]; $navn = $variant[1]
  $m = $merkeRaa.Clone(); $o = $ordRaa.Clone()
  Nokkel $m $hvit
  Nokkel $o $hvit

  $mH = 200; $mW = [int]($mH * $m.Width / $m.Height)
  $oH = 96;  $oW = [int]($oH * $o.Width / $o.Height)
  $gap = 34
  $ms = Skaler $m $mW $mH
  $os = Skaler $o $oW $oH

  $lock = New-Object System.Drawing.Bitmap ($mW + $gap + $oW), $mH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($lock)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($ms, 0, 0)
  $g.DrawImage($os, ($mW + $gap), [int](($mH - $oH) / 2))
  $g.Dispose()
  $lock.Save("$dst\$navn", [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Output "$navn : $($lock.Width) x $($lock.Height)"
  $lock.Dispose(); $ms.Dispose(); $os.Dispose(); $m.Dispose(); $o.Dispose()
}

# Merket alene - kvadratisk, til favicon og sma flater
$m2 = $merkeRaa.Clone()
Nokkel $m2 $false
$side = [Math]::Max($m2.Width, $m2.Height)
$kvad = New-Object System.Drawing.Bitmap $side,$side,([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($kvad)
$g.DrawImage($m2, [int](($side - $m2.Width)/2), [int](($side - $m2.Height)/2))
$g.Dispose()
$kvad.Save("$dst\logo-merke.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "logo-merke.png : $side x $side"

$fav = Skaler $kvad 180 180
$fav.Save("C:\Users\oskar\Prosjekter\kontorklar\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "favicon.png : 180 x 180"
$fav.Dispose(); $kvad.Dispose(); $m2.Dispose()

# Delingsbilde 1200x630 - hele logoen sentrert paa varm off-white
$og = New-Object System.Drawing.Bitmap 1200,630,([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($og)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.ColorTranslator]::FromHtml("#F7F6F3"))
$helRaa = Klipp 372 45 803 655      # merke + ordmerke + undertittel
$hel = $helRaa.Clone()
Nokkel $hel $false
$hH = 470; $hW = [int]($hH * $hel.Width / $hel.Height)
$hs = Skaler $hel $hW $hH
$g.DrawImage($hs, [int]((1200 - $hW)/2), [int]((630 - $hH)/2))
$g.Dispose()
$og.Save("$dst\og-image.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "og-image.png : 1200 x 630"
$og.Dispose(); $hs.Dispose(); $hel.Dispose(); $helRaa.Dispose()

$merkeRaa.Dispose(); $ordRaa.Dispose(); $orig.Dispose()
Write-Output "Ferdig."
