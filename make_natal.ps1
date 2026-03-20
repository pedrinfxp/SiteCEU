$ErrorActionPreference = "Stop"
$encoding = new-object System.Text.UTF8Encoding $false

# 1. Edit fotos-distribuicao-natal.html
$content = [IO.File]::ReadAllText("fotos-distribuicao-natal.html", $encoding)

$content = $content.Replace("Fotos Festa de Kardec", "Fotos Distribuição de Natal")
$content = $content.Replace("<h1>Fotos da Festa de Kardec</h1>", "<h1>Fotos da Distribuição de Natal</h1>")
$content = $content.Replace("EVENTOS MARCANTES", "AMOR EM AÇÃO")
$content = $content.Replace("A <strong>Festa de Kardec</strong> é um momento de união, alegria e celebração no <strong>Centro Espírita União</strong>.", "A <strong>Distribuição de Natal</strong> é um momento de união, alegria e solidariedade no <strong>Centro Espírita União</strong>.")

# Regex for filters
$newFilters = '<div class="filter-container animate-fade-in" style="margin-bottom: 60px;">
                    <button class="filter-btn active" data-year="2025">2025</button>
                    <button class="filter-btn" data-year="2024">2024</button>
                    <button class="filter-btn" data-year="2023">2023</button>
                    <button class="filter-btn" data-year="2022">2022</button>
                    <button class="filter-btn" data-year="2021">2021</button>
                    <button class="filter-btn" data-year="2020">2020</button>
                    <button class="filter-btn" data-year="2019">2019</button>
                    <button class="filter-btn" data-year="2017">2017</button>
                    <button class="filter-btn" data-year="2016">2016</button>
                    <button class="filter-btn" data-year="2015">2015</button>
                    <button class="filter-btn" data-year="2014">2014</button>
                    <button class="filter-btn" data-year="2013">2013</button>
                </div>'

$content = $content -replace '(?s)<div class="filter-container.*?</button>\s*</div>', $newFilters

$images_html = ""
$files_2014 = Get-ChildItem -Path "assets\DistribuiçãoNatal2014" -Filter "*.png" | Sort-Object Name
foreach ($f in $files_2014) {
    if ($f.Name -match "\.png$") {
        $images_html += '                    <div class="lecture-card revealed" data-year="2014" style="display: none;">
                        <a href="assets/DistribuiçãoNatal2014/' + $f.Name + '" data-lightbox="distribuicao-natal-2014" data-title="Distribuição de Natal 2014">
                            <div class="lecture-img"><img src="assets/DistribuiçãoNatal2014/' + $f.Name + '" style="object-fit: cover; width: 100%; height: 100%;" alt="Distribuição de Natal 2014"></div>
                        </a>
                    </div>' + "`n"
    }
}

$files_2013 = Get-ChildItem -Path "assets\DistribuiçãoNatal2013" -Filter "*.png" | Sort-Object Name
foreach ($f in $files_2013) {
    if ($f.Name -match "\.png$") {
        $images_html += '                    <div class="lecture-card revealed" data-year="2013" style="display: none;">
                        <a href="assets/DistribuiçãoNatal2013/' + $f.Name + '" data-lightbox="distribuicao-natal-2013" data-title="Distribuição de Natal 2013">
                            <div class="lecture-img"><img src="assets/DistribuiçãoNatal2013/' + $f.Name + '" style="object-fit: cover; width: 100%; height: 100%;" alt="Distribuição de Natal 2013"></div>
                        </a>
                    </div>' + "`n"
    }
}

$content = $content -replace '(?s)<div class="lectures-grid">.*?(?=\s*<div class="final-cta)', ('<div class="lectures-grid">' + $images_html + '                </div>')

[IO.File]::WriteAllText("fotos-distribuicao-natal.html", $content, $encoding)

# 2. Update navigational links in all HTML files
$all_html = Get-ChildItem -Path "." -Filter "*.html"
foreach ($html_f in $all_html) {
    $c = [IO.File]::ReadAllText($html_f.FullName, $encoding)
    $new_c = $c.Replace('<li><a href="#">Distribuição de Natal</a></li>', '<li><a href="fotos-distribuicao-natal.html">Distribuição de Natal</a></li>')
    if ($c -ne $new_c) {
        [IO.File]::WriteAllText($html_f.FullName, $new_c, $encoding)
    }
}

Write-Output "Done"
