#!/bin/sh

npx react-scripts build
touch build/composer.json
echo '{}' > build/composer.json
touch build/index.php
echo '<?php include_once("home.html"); ?>' > build/index.php

git subtree push --prefix build heroku master