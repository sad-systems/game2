<!DOCTYPE html>
<?php
$config = [
    'title'       => 'Advantures of Tosha - Enchanted Castle',
    'description' => '(c) 2016 SAD Systems - Game project',
    'keywords'    => 'game, html5, phaser, sad-systems',
];
extract($config);
?>
<html>
    <head>
        <title><?= $title ?></title>
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon"          type="image/vnd.microsoft.icon" href="favicon.ico" />
        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="favicon.ico" />
        <meta name="description" content="<?= $description ?>">
        <meta name="keywords" content="<?= $keywords ?>">        
    </head>
    <style>* {margin: 0; padding: 0;} html {background-color: #000; overflow:hidden;} canvas {margin: auto;}</style>
    <body>
    </body>
    <script src="build/phaser.min.js"></script>
    <script src="build/bundle.js"></script>
    <script>
        var application = require('application');
            application.run();
    </script>
</html>