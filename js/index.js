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
            var odds = [DATA_500[i]["odds"], -1, -1];
            var ids = [i, -1, [-1, -1]];
            var html = "<td>" + DATA_500[i]["t"] + "</td>";
            html += "<td>" + DATA_500[i]["home"] + "</td>";
            html += "<td>" + DATA_500[i]["away"] + "</td>";
            html += "<td>" + DATA_500[i]["odds"]["home"] + "</td>";
            html += "<td>" + DATA_500[i]["odds"]["draw"] + "</td>";
            html += "<td>" + DATA_500[i]["odds"]["away"] + "</td>";
            for (var j = 0; j < DATA_HKJC.length; j++) {
                if (DATA_500[i]["t"] == DATA_HKJC[j]["t"] && check_alias(DATA_500[i]["home"], DATA_HKJC[j]["home"]) && check_alias(DATA_500[i]["away"], DATA_HKJC[j]["away"])) {
                    ids[1] = j;
                    odds[1] = DATA_HKJC[j]["odds"];
                    html += "<td>" + DATA_HKJC[j]["odds"]["home"] + "</td>";
                    html += "<td>" + DATA_HKJC[j]["odds"]["draw"] + "</td>";
                    html += "<td>" + DATA_HKJC[j]["odds"]["away"] + "</td>";
                    break;
                }
            }
            if (odds[1] == -1) html += "<td>-</td><td>-</td><td>-</td>";
            for (j = 0; j < DATA_MACAU.length; j++) {
                if (DATA_MACAU[j]["odds"] && DATA_500[i]["t"] == DATA_MACAU[j]["t"] && check_alias(DATA_500[i]["home"], DATA_MACAU[j]["home"]) && check_alias(DATA_500[i]["away"], DATA_MACAU[j]["away"])) {
                    for (var k = 0; k < DATA_MACAU[j]["odds"].length; k++) {
                        var mode = parseInt(DATA_MACAU[j]["odds"][k]["mode"]);
                        if (mode == 3) {
                            ids[2] = [j, k];
                            odds[2] = DATA_MACAU[j]["odds"][k];
                            html += "<td>" + DATA_MACAU[j]["odds"][k]["team"] + " " + macau_market(mode) + "</td>";
                            html += "<td>" + DATA_MACAU[j]["odds"][k]["home"] + "</td>";
                            html += "<td>" + DATA_MACAU[j]["odds"][k]["away"] + "</td>";
                            break;
                        }
                    }
                    break;
                }
            }
            if (odds[2] == -1) html += "<td>-</td><td>-</td><td>-</td>";
            var score = strategy(odds, [RR["500"], RR["hkjc"], RR["macau"]]);
            html += "<td><span class='label label-" + (score < 1 ? "primary" : "default") + "'>" + score + "</span></td>";
            html += "</tr>";
            html = "<tr onclick='detail(" + ids[0] + "," + ids[1] + ",[" + ids[2][0] + "," + ids[2][1] + "]);'>" + html;
            $("#match-list tbody").append(html);
        }
        $("#match-list").DataTable({
            order: [[12, "asc"]]
        });
        bootbox.hideAll();
    }
}

function detail(id_500, id_hkjc, id_macau) {
    var max_h = Math.max(DATA_500[id_500]["odds"]["home"], (id_hkjc == -1 ? -1 : DATA_HKJC[id_hkjc]["odds"]["home"]), (id_macau[0] == -1 ? -1 : DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["home"]));
    var max_d = Math.max(DATA_500[id_500]["odds"]["draw"], (id_hkjc == -1 ? -1 : DATA_HKJC[id_hkjc]["odds"]["draw"]));
    var max_a = Math.max(DATA_500[id_500]["odds"]["away"], (id_hkjc == -1 ? -1 : DATA_HKJC[id_hkjc]["odds"]["away"]), (id_macau[0] == -1 ? -1 : DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["away"]));
    var html = "<h3>Details</h3><hr/><p>";
    html += "<img src='img/logo-500.png' style='height:1em;'/> ";
    html += "<a href='http://odds.500.com/fenxi/shuju-" + DATA_500[id_500]["id"] + ".shtml' target='_blank'>" + DATA_500[id_500]["home"] + " vs. " + DATA_500[id_500]["away"] + "</a><span class='pull-right'>";
    html += "<span class='label label-" + (max_h == DATA_500[id_500]["odds"]["home"] ? "primary" : "default") + "'>H</span><span class='label label-fade'>" + DATA_500[id_500]["odds"]["home"] + "</span> ";
    html += "<span class='label label-" + (max_d == DATA_500[id_500]["odds"]["draw"] ? "primary" : "default") + "'>D</span><span class='label label-fade'>" + DATA_500[id_500]["odds"]["draw"] + "</span> ";
    html += "<span class='label label-" + (max_a == DATA_500[id_500]["odds"]["away"] ? "primary" : "default") + "'>A</span><span class='label label-fade'>" + DATA_500[id_500]["odds"]["away"] + "</span>";
    html += "</span></p>";
    if (id_hkjc != -1) {
        html += "<hr/><p>";
        html += "<img src='img/logo-hkjc.gif' style='height:1em;'/> ";
        html += "<a href='http://bet.hkjc.com/football/odds/odds_allodds.aspx?tmatchid=" + DATA_HKJC[id_hkjc]["id"] + "' target='_blank'>" + DATA_HKJC[id_hkjc]["home"] + " vs. " + DATA_HKJC[id_hkjc]["away"] + "</a><span class='pull-right'>";
        html += "<span class='label label-" + (max_h == DATA_HKJC[id_hkjc]["odds"]["home"] ? "primary" : "default") + "'>H</span><span class='label label-fade'>" + DATA_HKJC[id_hkjc]["odds"]["home"] + "</span> ";
        html += "<span class='label label-" + (max_d == DATA_HKJC[id_hkjc]["odds"]["draw"] ? "primary" : "default") + "'>D</span><span class='label label-fade'>" + DATA_HKJC[id_hkjc]["odds"]["draw"] + "</span> ";
        html += "<span class='label label-" + (max_a == DATA_HKJC[id_hkjc]["odds"]["away"] ? "primary" : "default") + "'>A</span><span class='label label-fade'>" + DATA_HKJC[id_hkjc]["odds"]["away"] + "</span>";
        html += "</span></p>";
    }
    if (id_macau[0] != -1) {
        html += "<hr/><p>";
        html += "<img src='img/logo-macau.jpg' style='height:1em;'/> ";
        html += "<a href='http://web.macauslot.com/soccer/html/odds/list/ch-list_frame.html?2," + DATA_MACAU[id_macau[0]]["id"] + "' target='_blank'>" + DATA_MACAU[id_macau[0]]["home"] + " vs. " + DATA_MACAU[id_macau[0]]["away"] + "</a><span class='pull-right'>";
        html += "<span class='label label-info'>" + DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["team"] + " " + macau_market(parseInt(DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["mode"])) + "</span> ";
        html += "<span class='label label-" + (max_h == DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["home"] ? "primary" : "default") + "'>H</span><span class='label label-fade'>" + DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["home"] + "</span> ";
        html += "<span class='label label-" + (max_a == DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["away"] ? "primary" : "default") + "'>A</span><span class='label label-fade'>" + DATA_MACAU[id_macau[0]]["odds"][id_macau[1]]["away"] + "</span>";
        html += "</span></p>";
    }
    bootbox.alert(html);
}
