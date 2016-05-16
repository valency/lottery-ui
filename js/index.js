$(document).ready(function () {
    bootbox.dialog({
        message: loading_message("Loading... <span class='label label-default pull-right' id='loading-5c'>5C</span> <span class='label label-default pull-right' id='loading-hk-ch'>HK-CH</span> <span class='label label-default pull-right' id='loading-hk-en'>HK-EN</span> <span class='label label-default pull-right' id='loading-bf'>BF</span>"),
        closeButton: false
    });
    load_alias(function () {
        load_markets(analyze);
    });
    $("#rr-5c").html(RR["5C"]);
    $("#rr-hk").html(RR["HK-CH"]);
    $("#rr-bf").html(RR["BF"]);
});

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
    if (MARKETS["5C"] != null && MARKETS["HK-EN"] != null && MARKETS["HK-CH"] != null && MARKETS["BF"] != null) {
        bootbox.hideAll();
        bootbox.dialog({
            message: loading_message("Analyzing markets..."),
            closeButton: false
        });
        for (var i = 0; i < MARKETS["5C"]["markets"].length; i++) {
            var markets = {
                "5C": MARKETS["5C"]["markets"][i],
                "HK": null,
                "BF": null
            };
            var odds = [markets["5C"]["odd"], -1, -1];
            var ids = [i, -1, -1];
            var html = "<td>" + markets["5C"]["t"] + "</td>";
            html += "<td>" + markets["5C"]["home"] + "</td>";
            html += "<td>" + markets["5C"]["away"] + "</td>";
            html += "<td>" + odds[0]["home"] + "</td>";
            html += "<td>" + odds[0]["draw"] + "</td>";
            html += "<td>" + odds[0]["away"] + "</td>";
            for (var j = 0; j < MARKETS["HK-CH"]["markets"].length; j++) {
                if (markets["5C"]["t"] == MARKETS["HK-CH"]["markets"][j]["t"] && check_alias([markets["5C"]["home"], MARKETS["HK-CH"]["markets"][j]["home"]]) && check_alias([markets["5C"]["away"], MARKETS["HK-CH"]["markets"][j]["away"]])) {
                    markets["HK"] = MARKETS["HK-CH"]["markets"][j];
                    ids[1] = j;
                    odds[1] = markets["HK"]["odd"];
                    html += "<td>" + odds[1]["home"] + "</td>";
                    html += "<td>" + odds[1]["draw"] + "</td>";
                    html += "<td>" + odds[1]["away"] + "</td>";
                    break;
                }
            }
            if (odds[1] == -1) html += "<td>-</td><td>-</td><td>-</td>";
            for (j = 0; j < MARKETS["BF"]["markets"].length; j++) {
                if (markets["5C"]["t"] == MARKETS["BF"]["markets"][j]["t"] && check_alias([markets["5C"]["home"], MARKETS["BF"]["markets"][j]["home"]]) && check_alias([markets["5C"]["away"], MARKETS["BF"]["markets"][j]["away"]])) {
                    markets["BF"] = MARKETS["BF"]["markets"][j];
                    ids[2] = j;
                    odds[2] = markets["BF"]["odd"];
                    html += "<td>" + odds[2]["home"] + "</td>";
                    html += "<td>" + odds[2]["draw"] + "</td>";
                    html += "<td>" + odds[2]["away"] + "</td>";
                    break;
                }
            }
            if (odds[2] == -1) html += "<td>-</td><td>-</td><td>-</td>";
            var score = strategy(odds, [RR["5C"], RR["HK-CH"], RR["BF"]]);
            html += "<td><span class='label label-" + (score < 1 ? "primary" : "default") + "'>" + score + "</span></td>";
            html = "<tr onclick='detail(" + ids[0] + "," + ids[1] + "," + ids[2] + ");'>" + html + "</tr>";
            $("#match-list tbody").append(html);
        }
        $("#match-list").DataTable({
            order: [[12, "asc"]]
        });
        bootbox.hideAll();
    }
}

function detail(id_5c, id_hk, id_bf) {
    var odds = {
        "5C": {
            "home": (MARKETS["5C"]["markets"][id_5c]["odd"]["home"] / RR["5C"]).toFixed(4),
            "draw": (MARKETS["5C"]["markets"][id_5c]["odd"]["draw"] / RR["5C"]).toFixed(4),
            "away": (MARKETS["5C"]["markets"][id_5c]["odd"]["away"] / RR["5C"]).toFixed(4)
        },
        "HK": {
            "home": 0,
            "draw": 0,
            "away": 0
        },
        "BF": {
            "home": 0,
            "draw": 0,
            "away": 0
        }
    };
    if (id_hk >= 0) {
        odds["HK"] = {
            "home": (MARKETS["HK-CH"]["markets"][id_hk]["odd"]["home"] / RR["HK-CH"]).toFixed(4),
            "draw": (MARKETS["HK-CH"]["markets"][id_hk]["odd"]["draw"] / RR["HK-CH"]).toFixed(4),
            "away": (MARKETS["HK-CH"]["markets"][id_hk]["odd"]["away"] / RR["HK-CH"]).toFixed(4)
        };
    }
    if (id_bf >= 0) {
        odds["BF"] = {
            "home": (MARKETS["BF"]["markets"][id_bf]["odd"]["home"] / RR["BF"]).toFixed(4),
            "draw": (MARKETS["BF"]["markets"][id_bf]["odd"]["draw"] / RR["BF"]).toFixed(4),
            "away": (MARKETS["BF"]["markets"][id_bf]["odd"]["away"] / RR["BF"]).toFixed(4)
        };
    }
    var max_h = Math.max(odds["5C"]["home"], odds["HK"]["home"], odds["BF"]["home"]);
    var max_d = Math.max(odds["5C"]["draw"], odds["HK"]["draw"], odds["BF"]["draw"]);
    var max_a = Math.max(odds["5C"]["away"], odds["HK"]["away"], odds["BF"]["away"]);
    var html = "<h3>Details</h3><hr/><p>";
    html += "<img src='img/logo-500.png' style='height:1em;'/> ";
    html += "<a href='http://odds.500.com/fenxi/shuju-" + MARKETS["5C"]["markets"][id_5c]["market"] + ".shtml' target='_blank'>" + MARKETS["5C"]["markets"][id_5c]["home"] + " vs. " + MARKETS["5C"]["markets"][id_5c]["away"] + "</a><span class='pull-right'>";
    html += "<span class='label label-" + (max_h == odds["5C"]["home"] ? "primary" : "default") + "'>H</span><span class='label label-fade'>" + odds["5C"]["home"] + "</span> ";
    html += "<span class='label label-" + (max_d == odds["5C"]["draw"] ? "primary" : "default") + "'>D</span><span class='label label-fade'>" + odds["5C"]["draw"] + "</span> ";
    html += "<span class='label label-" + (max_a == odds["5C"]["away"] ? "primary" : "default") + "'>A</span><span class='label label-fade'>" + odds["5C"]["away"] + "</span>";
    html += "</span></p>";
    if (id_hk >= 0) {
        html += "<hr/><p>";
        html += "<img src='img/logo-hkjc.gif' style='height:1em;'/> ";
        html += "<a href='http://bet.hkjc.com/football/odds/odds_allodds.aspx?tmatchid=" + MARKETS["HK-CH"]["markets"][id_hk]["market"] + "' target='_blank'>" + MARKETS["HK-CH"]["markets"][id_hk]["home"] + " vs. " + MARKETS["HK-CH"]["markets"][id_hk]["away"] + "</a><span class='pull-right'>";
        html += "<span class='label label-" + (max_h == odds["HK"]["home"] ? "primary" : "default") + "'>H</span><span class='label label-fade'>" + odds["HK"]["home"] + "</span> ";
        html += "<span class='label label-" + (max_d == odds["HK"]["draw"] ? "primary" : "default") + "'>D</span><span class='label label-fade'>" + odds["HK"]["draw"] + "</span> ";
        html += "<span class='label label-" + (max_a == odds["HK"]["away"] ? "primary" : "default") + "'>A</span><span class='label label-fade'>" + odds["HK"]["away"] + "</span>";
        html += "</span></p>";
    }
    if (id_bf >= 0) {
        html += "<hr/><p>";
        html += "<img src='img/logo-betfair.png' style='height:1em;'/> ";
        html += "<a href='https://www.betfair.com/exchange/football/event?id=" + MARKETS["BF"]["markets"][id_bf]["market"] + "' target='_blank'>" + MARKETS["BF"]["markets"][id_bf]["home"] + " vs. " + MARKETS["BF"]["markets"][id_bf]["away"] + "</a><span class='pull-right'>";
        html += "<span class='label label-" + (max_h == odds["BF"]["home"] ? "primary" : "default") + "'>H</span><span class='label label-fade'>" + odds["BF"]["home"] + "</span> ";
        html += "<span class='label label-" + (max_d == odds["BF"]["draw"] ? "primary" : "default") + "'>D</span><span class='label label-fade'>" + odds["BF"]["draw"] + "</span> ";
        html += "<span class='label label-" + (max_a == odds["BF"]["away"] ? "primary" : "default") + "'>A</span><span class='label label-fade'>" + odds["BF"]["away"] + "</span>";
        html += "</span></p>";
    }
    bootbox.alert(html);
}
