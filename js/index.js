var STATE_500 = false;
var DATA_500 = [];
var STATE_HKJC = false;
var DATA_HKJC = [];
var STATE_MACAU = false;
var DATA_MACAU = [];
var RR = {
    500: 0.91,
    hkjc: 1.00,
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
        STATE_HKJC = false;
        $.get("/api/lottery/crawl/list/hkjc", function (resp) {
            DATA_HKJC = resp;
            STATE_HKJC = true;
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
    $("#rr-hkjc").html(RR["hkjc"]);
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

function strategy(odd, rr) {
    var max_h = -1;
    var max_d = -1;
    var max_a = -1;
    for (var i = 0; i < odd.length; i++) {
        if (odd[i]["home"] / rr[i] > max_h) max_h = odd[i]["home"] / rr[i];
        if (odd[i]["draw"] && odd[i]["draw"] / rr[i] > max_d) max_d = odd[i]["draw"] / rr[i];
        if (odd[i]["away"] / rr[i] > max_a) max_a = odd[i]["away"] / rr[i];
    }
    var score = 1 / max_h + 1 / max_d + 1 / max_a;
    return score.toFixed(4);
}

function analyze() {
    if (STATE_500 && STATE_HKJC && STATE_MACAU) {
        for (var i = 0; i < DATA_500.length; i++) {
            for (var h = 0; h < DATA_HKJC.length; h++) {
                for (var j = 0; j < DATA_MACAU.length; j++) {
                    if (DATA_500[i]["t"] == DATA_HKJC[h]["t"] && DATA_500[i]["t"] == DATA_MACAU[j]["t"]) {
                        if (check_alias(DATA_500[i]["home"], DATA_HKJC[h]["home"]) && check_alias(DATA_500[i]["home"], DATA_MACAU[j]["home"]) && check_alias(DATA_500[i]["away"], DATA_HKJC[h]["away"]) && check_alias(DATA_500[i]["away"], DATA_MACAU[j]["away"])) {
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
                                        html += "<td>" + DATA_HKJC[h]["odds"]["home"] + "</td>";
                                        html += "<td>" + DATA_HKJC[h]["odds"]["draw"] + "</td>";
                                        html += "<td>" + DATA_HKJC[h]["odds"]["away"] + "</td>";
                                        html += "<td>" + DATA_MACAU[j]["odds"][k]["team"] + " " + macau_market(mode) + "</td>";
                                        html += "<td>" + DATA_MACAU[j]["odds"][k]["home"] + "</td>";
                                        html += "<td>" + DATA_MACAU[j]["odds"][k]["away"] + "</td>";
                                        var score = strategy([DATA_500[i]["odds"], DATA_HKJC[h]["odds"], DATA_MACAU[j]["odds"][k]], [RR["500"], RR["hkjc"], RR["macau"]]);
                                        html += "<td><span class='label label-" + (score < 1 ? "primary" : "default") + "'>" + score + "</span></td>";
                                        html += "</tr>";
                                        $("#match-list tbody").append(html);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $("#match-list").DataTable({
            order: [[12, "asc"]]
        });
        bootbox.hideAll();
    }
}