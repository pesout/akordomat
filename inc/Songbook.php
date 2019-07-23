<?php

class SongBook {

    private $root;

    public function __construct() {
        $this->root = $_SERVER["DOCUMENT_ROOT"] . "/";
    }

    private function folderCheck() {
        if(is_writable($this->root . "songbooks/")) return true;
        else return false;
    }

    private function getPath($name) {
        return $this->root . "songbooks/" . $name . ".txt";
    }

    private function cleanString($string) {
        $string = str_replace(' ', '-', $string);
        return preg_replace('/[^A-Za-z0-9\-]/', '', $string);
    }

    public function save($name, $content) {
        // check and save
        return "zpěvník uložen jako <b>akordomat.cz/<wbr>" . $clean_name . "</b>";
    }

    public function load($name) {
        // check and load
        return $content;
    }

    public function import($url) {
        // check, import and parse
        return $song;
    }
}
