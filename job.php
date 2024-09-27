<?php
$url = 'https://www.jobs4dz.com/feed/';

// Récupérer le contenu de la page
$content = file_get_contents($url);

if ($content === FALSE) {
    echo "Erreur lors de la récupération du contenu.";
        exit;
        }

        $pattern = '/<figure.*?<\/figure>/is';

        preg_match_all($pattern, $content, $matches);

        if (!empty($matches[0])) {
            foreach ($matches[0] as $figure) {
                    echo $figure . "<br>";
                        }
                        } else {
echo "aucun résultats";                            }
                            ?>
