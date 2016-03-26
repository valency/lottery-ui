var STATE_500 = false;
var DATA_500 = [];
var STATE_MACAU = false;
var DATA_MACAU = [];
var RR = {
    500: 0.91,
    macau: 0.98
};

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
    $("#rr-500").html(RR["500"]);
    $("#rr-macau").html(RR["macau"]);
});

function macau_market(mode) {
    var base = Math.floor(mode / 2) * 0.5;
    if (mode % 2 == 0) {
        return (base - 0.5).toString() + "/" + base.toString();
    } else {
        return base;
    }
}

function strategy(home, draw, away, asian_home, asian_away, rr, asian_rr) {
    var odd = 1 / Math.max(home / rr, asian_home / asian_rr) + 1 / Math.max(draw / rr) + 1 / Math.max(away / rr, asian_away / asian_rr);
    return odd.toFixed(4);
}

function analyze() {
    if (STATE_500 && STATE_MACAU) {
        for (var i = 0; i < DATA_500.length; i++) {
            for (var j = 0; j < DATA_MACAU.length; j++) {
                if (DATA_500[i]["t"] == DATA_MACAU[j]["t"] && check_alias(DATA_500[i]["home"], DATA_MACAU[j]["home"]) && check_alias(DATA_500[i]["away"], DATA_MACAU[j]["away"])) {
                    if (DATA_MACAU[j]["odds"]) {
                        for (var k = 0; k < DATA_MACAU[j]["odds"].length; k++) {
                            var mode = parseInt(DATA_MACAU[j]["odds"][k]["mode"]);
                            if (mode == 3) {
                                var html = "<tr>";
                                html += "<td>" + DATA_500[i]["t"] + "</td>";
                                html += "<td>" + DATA_500[i]["home"] + "</td>";
                                html += "<td>" + DATA_500[i]["away"] + "</td>";
                                html += "<td>" + DATA_500[i]["odds"]["home"] + "</td>";
                                html += "<td>" + DATA_500[i]["odds"]["draw"] + "</td>";
                                html += "<td>" + DATA_500[i]["odds"]["away"] + "</td>";
                                html += "<td>" + DATA_MACAU[j]["odds"][k]["team"] + " " + macau_market(mode) + "</td>";
                                html += "<td>" + DATA_MACAU[j]["odds"][k]["home"] + "</td>";
                                html += "<td>" + DATA_MACAU[j]["odds"][k]["away"] + "</td>";
                                var score = strategy(DATA_500[i]["odds"]["home"], DATA_500[i]["odds"]["draw"], DATA_500[i]["odds"]["away"], DATA_MACAU[j]["odds"][k]["home"], DATA_MACAU[j]["odds"][k]["away"], RR["500"], RR["macau"]);
                                html += "<td><span class='label label-" + (score < 1 ? "primary" : "default") + "'>" + score + "</span></td>";
                                html += "</tr>";
                                $("#match-list tbody").append(html);
                            }
                        }
                    }
                }
            }
        }
        $("#match-list").DataTable({
            order: [[9, "asc"]]
        });
        bootbox.hideAll();
    }
}