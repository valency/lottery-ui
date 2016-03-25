var STATE_500 = false;
var DATA_500 = [];
var STATE_MACAU = false;
var DATA_MACAU = [];

$(document).ready(function () {
    bootbox.dialog({
        message: loading_message("Loading..."),
        closeButton: false
    });
    load_alias(function () {
        STATE_500 = false;
        $.get("/api/lottery/crawl/list/500", function (resp) {
            DATA_500 = resp;
            STATE_500 = true;
            analyze();
        });
        STATE_MACAU = false;
        $.get("/api/lottery/crawl/list/macau", function (resp) {
            DATA_MACAU = resp;
            STATE_MACAU = true;
            analyze();
        });
    });
});

function analyze() {
    if (STATE_500 && STATE_MACAU) {
        for (var i = 0; i < DATA_500.length; i++) {
            for (var j = 0; j < DATA_MACAU.length; j++) {
                if (DATA_500[i]["t"] == DATA_MACAU[j]["t"] && !(check_alias(DATA_500[i]["home"], DATA_MACAU[j]["home"]) && check_alias(DATA_500[i]["away"], DATA_MACAU[j]["away"]))) {
                    var exclamation = "";
                    var html = "<td>" + DATA_500[i]["t"] + "</td>";
                    var highlight = "";
                    if (string_overlap(DATA_500[i]["home"], DATA_MACAU[j]["home"])) {
                        exclamation += "!";
                        highlight = " class='text-danger'";
                    }
                    html += "<td" + highlight + ">" + DATA_500[i]["home"] + "</td>";
                    html += "<td" + highlight + ">" + DATA_MACAU[j]["home"] + "</td>";
                    highlight = "";
                    if (string_overlap(DATA_500[i]["away"], DATA_MACAU[j]["away"])) {
                        exclamation += "!";
                        highlight = " class='text-danger'";
                    }
                    html += "<td" + highlight + ">" + DATA_500[i]["away"] + "</td>";
                    html += "<td" + highlight + ">" + DATA_MACAU[j]["away"] + "</td>";
                    html += "<td><button class='btn btn-xs btn-default' onclick='alias_add(" + i + "," + j + ");'>Confirm Match</button></td>";
                    html += "</tr>";
                    $("#alias-list tbody").append("<tr><td><span class='label label-primary'>" + exclamation + "</span></td>" + html);
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
    bootbox.confirm("<p>The following aliases will be created:</p><pre>" + DATA_500[a]["home"] + " = " + DATA_MACAU[b]["home"] + "<br/>" + DATA_500[a]["away"] + " = " + DATA_MACAU[b]["away"] + "</pre>", function (resp) {
        if (resp) {
            if (DATA_500[a]["home"] != DATA_MACAU[b]["home"]) {
                $.get("/api/lottery/crawl/alias/add?a=" + DATA_500[a]["home"] + "&b=" + DATA_MACAU[b]["home"], function (resp) {
                    bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + DATA_500[a]["home"] + " = " + DATA_MACAU[b]["home"] + "</pre>");
                }).fail(function (resp) {
                    bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + DATA_500[a]["home"] + " = " + DATA_MACAU[b]["home"] + "</pre>");
                });
            }
            if (DATA_500[a]["away"] != DATA_MACAU[b]["away"]) {
                $.get("/api/lottery/crawl/alias/add?a=" + DATA_500[a]["away"] + "&b=" + DATA_MACAU[b]["away"], function (resp) {
                    bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + DATA_500[a]["away"] + " = " + DATA_MACAU[b]["away"] + "</pre>");
                }).fail(function (resp) {
                    bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + DATA_500[a]["away"] + " = " + DATA_MACAU[b]["away"] + "</pre>");
                });
            }
        }
    });
}

