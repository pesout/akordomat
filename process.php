<?php

session_start();
require("inc/Songbook.php");

// --- sessions, antispam ---

$sb = new SongBook;

if (isset($_GET["ACTION"]) && $_GET["ACTION"] == "save") {
    $name = htmlspecialchars($_POST["name"]);
    $songbook = htmlspecialchars($_POST["songbook"]);
    echo($sb->save($name, $songbook));
    die();
}

if (isset($_GET["ACTION"]) && $_GET["ACTION"] == "load") {
    $name = htmlspecialchars($_POST["name"]);
    echo($sb->load($name));
    die();
}

if (isset($_GET["ACTION"]) && $_GET["ACTION"] == "import") {
    $url = htmlspecialchars($_POST["url"]);
    echo($sb->import($url));
    die();
}

die("*chyba: neočekávaná chyba");
