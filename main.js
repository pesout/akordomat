/*
************************
Created by Stepan Pesout
*****www.pesout.eu******
************************
*/

window.user_scale = 0;
window.swap = [];
window.html_swap = [];
const isUpperCase = (string) => /^[A-Z]*$/.test(string);

function isMobile(breakpoint) {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    if (viewportWidth < breakpoint) return true;
    else return false;
}

function customizeWidth() {
    let longest_line = Math.max.apply(Math, $('.formated').map(function() {
        return $(this).width();
    }).get());
    let scale = $(".result").width() / longest_line;
    if (scale > 1) scale = 1;

    $(".result").css("transform", "scale(" + scale + ")");
    $(".container").css("height", parseInt($(".container").css("height")) * scale)
}

function errorDialog(content, err) {
    if (isMobile(450)) {
        if (err) alert("máme tu problém - " + content);
        return;
    }

    $("#error_dialog_content").html(content);
    if (err) $("#error_dialog").dialog("option", "title", "máme tu problém");
    else $("#error_dialog").dialog("option", "title", "povedlo se");
    $("#error_dialog").dialog("open");
}

warning_before_leave = false;

function updatePreview(button_pressed = false, no_warning = false) {
    if (!document.getElementById('automatic_preview').checked && button_pressed != 1) return;
    if (no_warning != 1) warning_before_leave = true;
    $("<button>").attr("disabled", true);

    if ($('#songbook').val().length > 1000) {
        $('.loading').css('display', 'block');
        setTimeout(function() {
            processSong();
        }, 1);
    } else processSong();
}

function processSong() {
    $(".result").html("");

    var songbook = $("#songbook").val().split("*");

    for (let h = 0; h < songbook.length; h++) {

        var chords;
        var lyrics;
        var shift;
        var is_chord;
        var chords_in_line;
        var line = 0;
        var transpose_space;
        var sharp_chord;

        if (songbook[h] == window.swap[h]) {
            $(".result").html($(".result").html() + window.html_swap[h]);
            continue;
        }

        var old_result = $(".result").html();

        var song = songbook[h];

        song += "@@@\n@@@"
        song = song.replace(/<[^>]*>?/gm, '');
        song = song.replace(/~/g, '');
        song = song.replace(/\r\n|\r|\n/g, "~");
        song = song.replace(/~~/g, '~ ~');

        song_lines = song.split("~");
        var end_line = song_lines.length - 1;

        while (song_lines[line].replace(/\s/g, '') == "") line++;
        $(".result").append("<strong>" + song_lines[line] + "</strong>");
        line++;
        while (song_lines[line].replace(/\s/g, '') == "") line++;
        while (song_lines[end_line].replace(/\s/g, '') == "") end_line--;

        for (let i = line; i < end_line + 1; i++) {

            var chords = document.createElement("section");
            var lyrics = document.createElement("section");

            shift = 0;
            is_chord = false;
            chords_in_line = false;
            transpose_space = false;
            sharp_chord = false;

            line_content = song_lines[i];

            try {
                line_content = line_content.replace(/\(/g, "[");
            } catch (e) {}
            try {
                line_content = line_content.replace(/\)/g, "]");
            } catch (e) {}
            longest_chord = line_content.lastIndexOf("]") - line_content.lastIndexOf("[");

            if (!Number.isInteger(longest_chord) || longest_chord < 1) longest_chord = 0;
            else
                for (let x = 0; x < longest_chord; x++) song_lines[i] += "x";

            for (let j = 0; j < song_lines[i].length; j++) {

                pos = song_lines[i].charAt(j);

                if (pos == "(" || pos == "[") {
                    is_chord = true;
                    chords_in_line = true;
                    continue;
                }
                if (pos == ")" || pos == "]") {
                    is_chord = false;
                    transpose_space = true;
                    continue;
                }

                if (is_chord) {
                    shift++;
                    if (isUpperCase(pos)) {
                        chords.innerHTML += "<span class='chord transpose'>" + pos + "</span>";
                    } else {
                        chords.innerHTML += "<span class='chord'>" + pos + "</span>";
                    }
                    if (pos == "#") sharp_chord = true;
                } else {

                    lyrics.innerHTML += pos;
                    if (shift > 0) {
                        shift--;
                        continue;
                    }
                    if (transpose_space && !sharp_chord) {
                        chords.innerHTML += "<span class='space transpose_space'>&nbsp;</span>";
                    } else {
                        chords.innerHTML += "<span class='space'>&nbsp;</span>";
                    }
                    transpose_space = false;
                    sharp_chord = false;
                }
            }

            if (lyrics.innerHTML == " ") chords_in_line = true;
            if (longest_chord) lyrics.innerHTML = lyrics.innerHTML.slice(0, -1 * longest_chord);

            chords.classList.add("formated");
            lyrics.classList.add("formated");

            if (chords_in_line) $(".result").append(chords);
            $(".result").append(lyrics);

            $(".result").html(($(".result").html().replace(/@@@/g, "")));
        }

        window.html_swap[h] = $(".result").html().replace(old_result, "");

    }

    window.swap = songbook;
    customizeWidth();
    $(".result").append("<br><br><br><br>");

    $('.loading').css("display", "none");
    $(".container").css("display", "block");
    $(".info").css("display", "none");
    if (!isMobile(600)) $("#tisk").css("display", "inline");
}
/*
function chordColor(change) {
	var colors = ["#f0f", "#000"];
	window.selected_color += change;
	$(".chord").css("color", colors[window.selected_color % 2]);
}
*/

function fontSize(change) {
    if (parseInt($(".chord").css("font-size")) < 9 && change < 0) return;
    if (parseInt($(".chord").css("font-size")) > 25 && change > 0) return;

    if (change == 1) change = "+=1";
    else change = "-=1";

    $(".chord").css("font-size", change);
    $(".space").css("font-size", change);
    $(".formated").css("font-size", change);
    $("strong").css("font-size", change);

    customizeWidth();
}
/*
var autoscr = false;
function autoScroll(stop = false) {
	if (autoscr || stop) {
		clearInterval(autoscr);
		autoscr = false;
		$("#autoscr").html("zapnout posouvání");
		return;
	}
	$("#autoscr").html("vypnout posouvání");
	autoscr = setInterval(function(){
		window.scrollTo({
			top: $(window).scrollTop() + 1,
			behavior: 'smooth'
		});
	}, 200)
}
*/
function transpose() {
	$('.transpose').each(function(i, obj) {
		var sharp = false;
	    if (! $(this).nextAll('.space:first').hasClass("transpose_space")) sharp = true;

	    if (this.innerHTML == "C" && !sharp) {transposeReplace($(this));      return;}
	    if (this.innerHTML == "C" &&  sharp) {transposeReplace($(this), "D"); return;}
	    if (this.innerHTML == "D" && !sharp) {transposeReplace($(this));      return;}
	    if (this.innerHTML == "D" &&  sharp) {transposeReplace($(this), "E"); return;}
	    if (this.innerHTML == "E" && !sharp) {transposeReplace($(this), "F"); return;}
	    if (this.innerHTML == "F" && !sharp) {transposeReplace($(this));      return;}
	    if (this.innerHTML == "F" &&  sharp) {transposeReplace($(this), "G"); return;}
	    if (this.innerHTML == "G" && !sharp) {transposeReplace($(this));      return;}
	    if (this.innerHTML == "G" &&  sharp) {transposeReplace($(this), "A"); return;}
	    if (this.innerHTML == "A" && !sharp) {transposeReplace($(this), "B"); return;}
	    if (this.innerHTML == "A" && sharp)  {transposeReplace($(this), "H"); return;} // also B, but retarded
	    if (this.innerHTML == "B" && !sharp) {transposeReplace($(this), "H"); return;}
	    if (this.innerHTML == "H" && !sharp) {transposeReplace($(this), "C"); return;}
	});
}

function transposeReplace(chord, next = false) {
    if (!next) {
        chord.after("<span class='chord'>#</span>");
        $(".chord").css("font-size", $(".chord").css("font-size"));
        chord.nextAll('.space:first').removeClass("transpose_space");
        chord.nextAll('.space:first').html("");
    } else {
        chord.html(next);
        if (chord.nextAll('.chord:first').html() == "#") {
            chord.nextAll('.chord:first').remove();
            chord.nextAll('.space:first').html("&nbsp;");
            chord.nextAll('.space:first').addClass("transpose_space");
        }
    }
}

songbook_saved = true;

function addToTextarea(content, replace) {
    if ($("#songbook").val().replace(/\s/g, '') == "") replace = true;

    if (replace) $("#songbook").val(content);
    else {
        $("#songbook").val($("#songbook").val() + "\n*\n" + content);
        songbook_saved = false;
    }
}

function saved(response) {
    if (response.includes("*chyba: ")) {
        errorDialog(response.substr(8), true);
        return false;
    }
    warning_before_leave = false;
    $("#editor").dialog("close");
    errorDialog(response, false);
}

function loaded(response) {
    if (response.includes("*chyba: ")) {
        errorDialog(response.substr(8), true);
        return false;
    }

    addToTextarea(response, document.getElementById('replace_content_l').checked);
    try {
        $("#load").dialog("close");
    } catch (e) {};

    updatePreview(1, 1);
}

function imported(response) {
    if (response.includes("*chyba: ")) {
        errorDialog(response.substr(8), true);
        return false;
    }

    addToTextarea(response, document.getElementById('replace_content_i').checked);
    $("#import").dialog("close");
    updatePreview(1);
}


function readFile() {
    var songbook_file = document.getElementById('songbook_file').files;

    var reader = new FileReader();
    if (songbook_file[0].size > 524288) {
        errorDialog("soubor je příliš velký", true);
        return;
    }
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
            addToTextarea(evt.target.result, document.getElementById('replace_content_n').checked);
            $("#file_load").dialog("close");
            updatePreview(1);
        }
    };
    reader.readAsBinaryString(songbook_file[0].slice(0, songbook_file[0].size));

}

$.ui.dialog.prototype._oldinit = $.ui.dialog.prototype._init;
$.ui.dialog.prototype._init = function() {
    $(this.element).parent().css('position', 'fixed');
    $(this.element).dialog("option", {
        resizeStop: function(event, ui) {
            var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                (Math.floor(ui.position.top) - $(window).scrollTop())
            ];
            $(event.target).parent().css('position', 'fixed');
            $(event.target).dialog('option', 'position', position);
            return true;
        }
    });
    this._oldinit();
};

$(function() {
    $("#editor").dialog({
        resize: function(event, ui) {
            let dialog_h = parseInt($("#editor").css("height"), 10);
            $("#songbook").css("height", dialog_h - 110);
        },
        autoOpen: false,
        title: "editor",
        show: {
            effect: "fade",
            duration: 300
        },
        hide: {
            effect: "fade",
            duration: 300
        },
        width: 475,
        minWidth: 475,
        height: 483,
        minHeight: 473
    });
});

$(function() {
    if (!isMobile(600)) {
        $("#load").dialog({
            resizable: false,
            autoOpen: false,
            title: "nahrát uložené",
            show: {
                effect: "fade",
                duration: 300
            },
            hide: {
                effect: "fade",
                duration: 300
            },
            width: 350,
            height: 210
        });
    } else {
        var open_this = true;
        if (load_autosubmit) open_this = false;
        $("#load").dialog({
            resizable: false,
            autoOpen: open_this,
            title: "nahrát uložené",
            show: {
                effect: "fade",
                duration: 300
            },
            hide: {
                effect: "fade",
                duration: 300
            },
            width: 290,
            height: 150
        });

        document.getElementById("replace_content_l").checked = true;
    }
});

$(function() {
    $("#import").dialog({
        resizable: false,
        autoOpen: false,
        title: "import ze supermusic",
        show: {
            effect: "fade",
            duration: 300
        },
        hide: {
            effect: "fade",
            duration: 300
        },
        width: 350,
        height: 210
    });
});

$(function() {
    $("#file_load").dialog({
        resizable: false,
        autoOpen: false,
        title: "nahrát soubor",
        show: {
            effect: "fade",
            duration: 300
        },
        hide: {
            effect: "fade",
            duration: 300
        },
        width: 350,
        height: 155
    });
});

$(function() {
    $("#error_dialog").dialog({
        resizable: false,
        autoOpen: false,
        title: "máme tu problém",
        show: {
            effect: "fade",
            duration: 100
        },
        hide: {
            effect: "fade",
            duration: 100
        },
        width: 400
    });
});

$("#open_editor").click(function() {
    $("#editor").dialog("open");
});

$("#open_load").click(function() {
    $("#load").dialog("open");
});

$("#open_import").click(function() {
    $("#import").dialog("open");
});

$("#open_file_load").click(function() {
    $("#file_load").dialog("open");
});

$("header").click(function() {
    window.location = "https://www.akordomat.cz";
});


$("#songbook").change(updatePreview).keyup(updatePreview);
$("#songbook_file").change(readFile);
$("#automatic_preview").change(function() {
    if (this.checked) {
        $("#manual_update").hide();
        updatePreview();
        return;
    }
    $("#manual_update").show();
});

$("#save_form").submit(function(event) {
    event.preventDefault();
    var post_url = $(this).attr("action");
    var request_method = $(this).attr("method");
    var form_data = $(this).serialize();
    $.ajax({
            url: post_url,
            type: request_method,
            data: form_data
        })
        .done(function(e) {
            saved(e);
        })
        .fail(function() {
            alert("Něco se pokazilo, zkuste prosím zopakovat akci později.");
        });
});

$("#load_form").submit(function(event) {
    event.preventDefault();
    var post_url = $(this).attr("action");
    var request_method = $(this).attr("method");
    var form_data = $(this).serialize();
    $.ajax({
            url: post_url,
            type: request_method,
            data: form_data
        })
        .done(function(e) {
            loaded(e);
        })
        .fail(function() {
            alert("Něco se pokazilo, zkuste prosím zopakovat akci později.");
        });
});

$("#import_form").submit(function(event) {
    event.preventDefault();
    var post_url = $(this).attr("action");
    var request_method = $(this).attr("method");
    var form_data = $(this).serialize();
    $.ajax({
            url: post_url,
            type: request_method,
            data: form_data
        })
        .done(function(e) {
            imported(e);
        })
        .fail(function() {
            alert("Něco se pokazilo, zkuste prosím zopakovat akci později.");
        });
});

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    var main_menu_h = 0;
    if ($("#main_menu").css("display") == "block") {
        main_menu_h = parseInt($("#main_menu").css("height"), 10) +
            parseInt($("#main_menu").css("padding-bottom"), 10) +
            parseInt($("#main_menu").css("padding-top"), 10);
    } else return;
    if (prevScrollpos > currentScrollPos) {
        $("#main_menu").css("top", "50px");
        //autoScroll(true);
    } else {
        $("#main_menu").css("top", 50 - main_menu_h);
    }
    prevScrollpos = currentScrollPos;
}

$(document).ready(function() {
    document.title = "a k o r d o m a t";
});

$(window).resize(customizeWidth);


function err() {
    return true;
}
window.onerror = err;

$(window).bind('beforeunload', function() {
    if (warning_before_leave) return true;
});
