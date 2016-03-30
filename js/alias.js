var STATE_FIVE = false;
var DATA_FIVE = [];
var STATE_HKJC = false;
var DATA_HKJC = [];
var STATE_HKJC_EN = false;
var DATA_HKJC_EN = [];
var STATE_BF = false;
var DATA_BF = [];

$(document).ready(function () {
    bootbox.dialog({
        message: loading_message("Loading..."),
        closeButton: false
    });
    load_alias(function () {
        STATE_FIVE = false;
        $.get("/api/lottery/market/list/hkjc/?src=5C", function (resp) {
            STATE_FIVE = true;
            DATA_FIVE = resp;
            analyze();
        });
        STATE_HKJC = false;
        $.get("/api/lottery/market/list/hkjc/?src=HK", function (resp) {
            STATE_HKJC = true;
            DATA_HKJC = resp;
            analyze();
        });
        STATE_HKJC_EN = false;
        $.get("/api/lottery/market/list/hkjc/?src=HK&lang=en", function (resp) {
            STATE_HKJC_EN = true;
            DATA_HKJC_EN = resp;
            analyze();
        });
        STATE_BF = false;
        $.get("/api/lottery/market/list/hkjc/?src=BF", function (resp) {
            STATE_BF = true;
            DATA_BF = resp;
            analyze();
        });
    });
});

function analyze() {
    if (STATE_FIVE && STATE_HKJC_EN && STATE_HKJC && STATE_BF) {
        for (var i = 0; i < DATA_FIVE.length; i++) {
            for (var j = 0; j < DATA_HKJC.length; j++) {
                var hkjc_en_id = -1;
                for (var k = 0; k < DATA_HKJC_EN.length; k++) {
                    if (DATA_HKJC[j]["market"] == DATA_HKJC_EN[k]["market"]) {
                        hkjc_en_id = k;
                        break;
                    }
                }
                if (hkjc_en_id == -1) continue;
                for (k = 0; k < DATA_BF.length; k++) {
                    if (DATA_FIVE[i]["t"] == DATA_HKJC[j]["t"] && DATA_FIVE[i]["t"] == DATA_BF[k]["t"]) {
                        if (!(check_alias(DATA_FIVE[i]["home"], DATA_HKJC[j]["home"], DATA_BF[k]["home"]) && check_alias(DATA_FIVE[i]["away"], DATA_HKJC[j]["away"], DATA_BF[k]["away"]))) {
                            var exclamation = "";
                            var html = "<td>" + DATA_FIVE[i]["t"] + "</td>";
                            var highlight = "";
                            if (string_overlap(DATA_FIVE[i]["home"], DATA_HKJC[j]["home"])) {
                                exclamation += "!";
                                highlight = " class='text-danger'";
                            }
                            html += "<td" + highlight + ">" + DATA_FIVE[i]["home"] + "</td>";
                            html += "<td" + highlight + ">" + DATA_HKJC[j]["home"] + "</td>";
                            if (string_overlap(DATA_HKJC_EN[hkjc_en_id]["home"], DATA_BF[k]["home"])) {
                                exclamation += "!";
                                highlight = " class='text-danger'";
                            }
                            html += "<td" + highlight + ">" + DATA_BF[k]["home"] + "</td>";
                            highlight = "";
                            if (string_overlap(DATA_FIVE[i]["away"], DATA_HKJC[j]["away"])) {
                                exclamation += "!";
                                highlight = " class='text-danger'";
                            }
                            html += "<td" + highlight + ">" + DATA_FIVE[i]["away"] + "</td>";
                            html += "<td" + highlight + ">" + DATA_HKJC[j]["away"] + "</td>";
                            if (string_overlap(DATA_HKJC_EN[hkjc_en_id]["away"], DATA_BF[k]["away"])) {
                                exclamation += "!";
                                highlight = " class='text-danger'";
                            }
                            html += "<td" + highlight + ">" + DATA_BF[k]["away"] + "</td>";
                            html += "<td><button class='btn btn-xs btn-default' onclick='alias_add(" + i + "," + j + ");'>Confirm Match</button></td>";
                            html += "</tr>";
                            $("#alias-list tbody").append("<tr><td><span class='label label-primary'>" + exclamation + "</span></td>" + html);
                        }
                    }
                }
            }
        }
        $("#alias-list").DataTable({
            order: [[0, "desc"]]
        });
        bootbox.hideAll();
    }
}

function alias_add(a, b) {
    bootbox.confirm("<p>The following aliases will be created:</p><pre>" + DATA_FIVE[a]["home"] + " = " + DATA_HKJC[b]["home"] + "<br/>" + DATA_FIVE[a]["away"] + " = " + DATA_HKJC[b]["away"] + "</pre>", function (resp) {
        if (resp) {
            if (DATA_FIVE[a]["home"] != DATA_HKJC[b]["home"]) {
                $.get("/api/lottery/crawl/alias/add?a=" + DATA_FIVE[a]["home"] + "&b=" + DATA_HKJC[b]["home"], function (resp) {
                    bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + DATA_FIVE[a]["home"] + " = " + DATA_HKJC[b]["home"] + "</pre>");
                }).fail(function (resp) {
                    bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + DATA_FIVE[a]["home"] + " = " + DATA_HKJC[b]["home"] + "</pre>");
                });
            }
            if (DATA_FIVE[a]["away"] != DATA_HKJC[b]["away"]) {
                $.get("/api/lottery/crawl/alias/add?a=" + DATA_FIVE[a]["away"] + "&b=" + DATA_HKJC[b]["away"], function (resp) {
                    bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + DATA_FIVE[a]["away"] + " = " + DATA_HKJC[b]["away"] + "</pre>");
                }).fail(function (resp) {
                    bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + DATA_FIVE[a]["away"] + " = " + DATA_HKJC[b]["away"] + "</pre>");
                });
            }
        }
    });
}

