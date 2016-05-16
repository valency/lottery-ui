var PLATFORMS = {
    "5C": "Lottery 500 (zh-CN)",
    "HK-CH": "The Hong Kong Jockey Club (zh-TW)",
    "HK-EN": "The Hong Kong Jockey Club (en-UK)",
    "BF": "BetFair (en-UK)"
    // "MS": "MacauSlot (zh-TW)"
};
var ALIAS = [];
var MARKETS = {
    "5C": null,
    "HK-CH": null,
    "HK-EN": null,
    "BF": null
    // "MS": null
};
var RR = {
    "5C": 0.907,
    "HK-CH": 1,
    "HK-EN": 1,
    "BF": 1
    // "MS": 0.98
};

function load_alias(callback) {
    $.get("/api/lottery/alias/list/", function (resp) {
        ALIAS = resp;
        callback();
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert(error_message("Failed to load aliases!"));
    });
}

function check_alias(p) {
    if (p.length < 2) return true;
    else {
        var all_same = true;
        for (var i = 1; i < p.length; i++) {
            if (p[i] != p[0]) {
                all_same = false;
                break;
            }
        }
        if (all_same) return true;
        else {
            for (i = 0; i < ALIAS.length; i++) {
                for (var j = 0; j < p.length; j++) {
                    if (ALIAS[i]["list"].indexOf(p[j]) < 0) break;
                }
                if (j == p.length) return true;
            }
            return false;
        }
    }
}

function load_market(src, callback) {
    $.get("/api/lottery/market/query/?src=" + src, function (resp) {
        $("#loading-" + src.toLowerCase()).switchClass("label-default", "label-primary");
        MARKETS[src] = resp;
        callback();
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert(error_message("Failed to load markets of " + PLATFORMS[src] + "!"));
    });
}

function load_markets(callback) {
    load_market("5C", callback);
    load_market("HK-CH", callback);
    load_market("HK-EN", callback);
    load_market("BF", callback);
}

