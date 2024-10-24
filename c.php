<?php
$url = "https://www.lachainemeteo.com/meteo-algerie/pays-4/previsions-meteo-algerie-aujourdhui";
$content = file_get_contents($url);
if (preg_match('/(http.*\.m3u8)/', $content, $matches)) {
    $m3u8_url = $matches[1];
} else {
    die("Aucun fichier .m3u8 trouvé.");
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lecteur Plyr</title>
    <!-- Inclure la CSS de Plyr -->
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.8/plyr.css" />
    <style>
        body {
            background-color: black;
            margin: 0;
            padding: 0;
        }
        .plyr__video-embed {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>

<!-- Créer dynamiquement un lecteur Plyr avec l'URL .m3u8 capturée -->
<video id="player" playsinline controls autoplay muted width="100%" height="100%">
    <source src="<?php echo $m3u8_url; ?>" type="application/x-mpegURL" />
</video>

<!-- Inclure la JS de Plyr -->
<script src="https://cdn.plyr.io/3.6.8/plyr.js"></script>
<script>
    // Initialiser le lecteur Plyr
    const player = new Plyr('#player', {
        autoplay: true,
        muted: true,
        fluid: true
    });
</script>

</body>
</html>
