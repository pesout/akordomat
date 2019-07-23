<?php
    // php code
?>

<!DOCTYPE HTML>

<!--
************************
Created by Stepan Pesout
*****www.pesout.eu******
************************
-->

    <html prefix="og: http://ogp.me/ns#">

    <head>
        <meta http-equiv="Content-Language" content="cs">
        <meta charset="UTF-8">

        <link rel="icon" type="image/png" href="favicon.png">

        <link rel="stylesheet" href="reset.css">
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css">
        <link rel="stylesheet" href="main.css">

        <title>akordomat</title>
        <meta name="application-name" content="akordomat">
        <meta name="description" content="Nástroj pro tvorbu a sdílení zpěvníků či textů skladeb s kytarovými akordy">
        <meta property="fb:admins" content="100001802478636">
        <meta property="og:title" content="akordomat">
        <meta property="og:site_name" content="akordomat">
        <meta property="og:description" content="Nástroj pro tvorbu a sdílení zpěvníků či textů skladeb s kytarovými akordy">
        <meta property="og:locale" content="cs_CZ">
        <meta name="keywords" content="kytara, akord, zpěvník, sdílení, skladba, píseň, transpozice">
        <meta name="theme-color" content="#ff4fff">

        <meta name="author" content="Štěpán Pešout">
        <link rel="author" href="http://github.com/pesout">

        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="#ff4fff">
        <meta name="apple-mobile-web-app-title" content="akordomat">

        <script src="jquery-3.3.1.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

    </head>

    <body>
        <header>
            <h1>akordomat</h1>
        </header>

        <div class="loading">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="loading loading2">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>

        <div id="error_dialog">
            <br>
            <span id="error_dialog_content">&nbsp;</span>
            <br>
            <br>
            <button onclick="$('#error_dialog').dialog('close')">chápu</button>
        </div>

        <menu id="main_menu">
            <a href="javascript:void(0);" id="open_editor">otevřít&nbsp;editor</a>
            <a href="javascript:void(0);" id="open_load">nahrát&nbsp;uložené</a>
            <span class="line_br_main"><br></span>
            <a href="javascript:void(0);" id="open_import">import&nbsp;ze&nbsp;supermusic</a>
            <a href="javascript:void(0);" id="open_file_load">nahrát&nbsp;soubor</a>
            <a href="javascript:window.print();" id="tisk">tisk</a>
        </menu>

        <menu id="controls">
            <a href="javascript:void(0)" onclick="transpose()">transponovat</a>
            <a href="javascript:void(0)" onclick="fontSize(1)" class="size_regulation">zvětšit</a>
            <a href="javascript:void(0)" onclick="fontSize(-1)" class="size_regulation">zmenšit</a>
        </menu>

        <section class="main">

            <section class="info big_screen">
                <iframe class="example" src="https://www.youtube.com/embed/TYEKJc9LJR0"></iframe>
                <h2>Jak na zápis akordů a textu</h2>
                <p>Můžete jej provádět z okna editoru, výsledek se zobrazuje po kliknutí na tlačítko "obnovit".</p>
                <p>Akordy se zobrazí nad textem, pokud jsou v kulatých nebo hranatých závorkách. Jednotlivé písně se oddělují hvězdičkou. Pomocí tlačítka "nahrát uložené" si můžete <a href="ukazka">načíst zpěvník s názvem "ukazka"</a>, který slouží jako příklad.</p>

                <h2>Ukládání a načítání</h2>
                <p>Uložení je možné přímo z editoru, poté již zpěvníky již nelze upravit. Můžete si však načíst starý zpěvník, změnit jej a uložit pod novým názvem. Samozřejmě můžete načíst i několik skladeb či zpěvníků do sebe.</p>

                <h2>Další informace</h2>
                <p>Aplikace je stále ve vývoji, omluvte tedy prosím případné chyby a nedokonalosti. V mobilní verzi je zatím možné pouze prohlížení zpěvníků, nikoli tvorba.</p>
                <p>
                    <br><a href="http://pesout.eu" target="_blank">autor</a>
                    <br>
                    <br>
                    <br>
                </p>
            </section>

            <section class="info small_screen">
                <h2>Tip</h2>
                <p>Nemáte ještě zpěvník? Podívejte se na <a href="ukazka">ukázku</a>.</p>
            </section>

            <div id="editor">
                <form action="process.php?ACTION=save" method="post" id="save_form">
                    <textarea id="songbook" name="songbook"></textarea>
                    <input name="name" type="text" placeholder="název (písmena, číslice a pomlčka)" maxlength="45" pattern="[a-zA-Z0-9-]+" required>
                    <input class="antispam" name="antispam" type="text" placeholder="antispam">
                    <button id="save" type="submit">uložit</button>
                </form>
                <menu>
                    <label class="switch">
                        <input type="checkbox" id="automatic_preview" name="automatic_preview">
                        <span class="slider"></span>
                    </label>
                    <button id="manual_update" onclick="updatePreview(1)">obnovit</button>
                    <br>
                    <span>automatické obnovování náhledu,<br>(aplikace bude reagovat pomaleji)</span>
                    <br>
                </menu>
            </div>

            <div id="load">
                <form action="process.php?ACTION=load" method="post" id="load_form">
                    <input name="name" type="text" placeholder="název zpěvníku" maxlength="50">
                    <input class="antispam" name="antispam" type="text" placeholder="antispam">
                    <menu>
                        <label class="switch">
                            <input type="checkbox" id="replace_content_l" name="replace_content_l">
                            <span class="slider"></span>
                        </label>
                        <br>
                        <span>nahrazení aktuálního zpěvníku<br>nahraným obsahem</span>
                        <br>
                    </menu>
                    <button type="submit">nahrát</button>
                </form>
            </div>

            <div id="import">
                <form action="process.php?ACTION=import" method="post" id="import_form">
                    <input id="url" name="url" type="text" placeholder="adresa na supermusic.cz">
                    <input class="antispam" name="antispam" type="text" placeholder="antispam">
                    <menu>
                        <label class="switch">
                            <input type="checkbox" id="replace_content_i" name="replace_content_i">
                            <span class="slider"></span>
                        </label>
                        <br>
                        <span>nahrazení aktuálního zpěvníku<br>nahraným obsahem</span>
                        <br>
                    </menu>
                    <button type="submit">import</button>
                </form>
            </div>

            <div id="file_load">
                <form id="file_load_form">
                    <menu>
                        <label class="switch">
                            <input type="checkbox" id="replace_content_n" name="replace_content_n">
                            <span class="slider"></span>
                        </label>
                        <br>
                        <span>nahrazení aktuálního zpěvníku<br>nahraným obsahem</span>
                        <br>
                    </menu>
                    <label for="songbook_file">vybrat soubor</label>
                    <input type="file" id="songbook_file">
                </form>
            </div>
            <section class="container">
                <section class="result">
                    &nbsp;
                </section>
            </section>

            <span class='chord'>&nbsp;</span>
        </section>

        <script src="main.js"></script>
    	<script>
        	var ua = window.navigator.userAgent;
        	var msie = ua.indexOf("MSIE ");
        	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        		alert('Interner Explorer bohužel nepodporujeme. Použijte prosím jiný prohlížeč, například Chrome nebo Firefox.');
        	}

    		var load_autosubmit = "<?php echo (isset($_GET["zp"])) ? $_GET["zp"] : false; ?>";
    		<?php unset($_GET["zp"]); ?>
    		if (load_autosubmit) {
    			$("#load_form input:first-child").val(load_autosubmit);
    			$("#load_form").submit();
    		}
    	</script>
    </body>
    </html>
