var DATA = {
    "5C": null,
    "HK-CH": null,
    "HK-EN": null,
    "BF": null
};
var STATE = {
    "5C": false,
    "HK-CH": false,
    "HK-EN": false,
    "BF": false
};

$(document).ready(function () {
    bootbox.dialog({
        message: loading_message("Loading... <span class='label label-default pull-right' id='loading-5c'>5C</span> <span class='label label-default pull-right' id='loading-hk-ch'>HK-CH</span> <span class='label label-default pull-right' id='loading-hk-en'>HK-EN</span> <span class='label label-default pull-right' id='loading-bf'>BF</span>"),
        closeButton: false
    });
    load_alias(function () {
        STATE["5C"] = false;
        $.get("/api/lottery/market/query/?src=5C", function (resp) {
            $("#loading-5c").switchClass("label-default", "label-primary");
            STATE["5C"] = true;
            DATA["5C"] = resp;
            analyze();
        });
        STATE["HK-CH"] = false;
        $.get("/api/lottery/market/query/?src=HK-CH", function (resp) {
            $("#loading-hk-ch").switchClass("label-default", "label-primary");
            STATE["HK-CH"] = true;
            DATA["HK-CH"] = resp;
            analyze();
        });
        STATE["HK-EN"] = false;
        $.get("/api/lottery/market/query/?src=HK-EN", function (resp) {
            $("#loading-hk-en").switchClass("label-default", "label-primary");
            STATE["HK-EN"] = true;
            DATA["HK-EN"] = resp;
            analyze();
        });
        STATE["BF"] = false;
        $.get("/api/lottery/market/query/?src=BF", function (resp) {
            $("#loading-bf").switchClass("label-default", "label-primary");
            STATE["BF"] = true;
            DATA["BF"] = resp;
            analyze();
        });
    });
});

function analyze() {
    if (STATE["5C"] && STATE["HK-EN"] && STATE["HK-CH"] && STATE["BF"]) {
        bootbox.hideAll();
        bootbox.dialog({
            message: loading_message("Analyzing aliases..."),
            closeButton: false
        });
        setTimeout(function () {
            for (var i = 0; i < DATA["5C"]["markets"].length; i++) {
                var data = {
                    "5C": DATA["5C"]["markets"][i],
                    "HK-CH": null,
                    "HK-EN": null,
                    "BF": null
                };
                for (var j = 0; j < DATA["HK-CH"]["markets"].length; j++) {
                    for (var k = 0; k < DATA["HK-EN"]["markets"].length; k++) {
                        if (DATA["HK-CH"]["markets"][j]["market"] == DATA["HK-EN"]["markets"][k]["market"]) {
                            data["HK-CH"] = DATA["HK-CH"]["markets"][j];
                            data["HK-EN"] = DATA["HK-EN"]["markets"][k];
                            break;
                        }
                    }
                    if (data["HK-CH"] != null && data["HK-EN"] != null) {
                        for (k = 0; k < DATA["BF"]["markets"].length; k++) {
                            data["BF"] = DATA["BF"]["markets"][k];
                            if (data["5C"]["t"].substring(0, 10) == data["HK-CH"]["t"].substring(0, 10) && data["5C"]["t"].substring(0, 10) == data["BF"]["t"].substring(0, 10)) {
                                if (!(check_alias(data["5C"]["home"], data["HK-CH"]["home"], data["BF"]["home"]) && check_alias(data["5C"]["away"], data["HK-CH"]["away"], data["BF"]["away"]))) {
                                    var exclamation = "";
                                    var html = "<td>" + data["5C"]["t"] + "</td>";
                                    var highlight = "";
                                    if (string_overlap(data["5C"]["home"], data["HK-CH"]["home"])) {
                                        exclamation += "!";
                                        highlight = " class='text-danger'";
                                    }
                                    html += "<td" + highlight + ">" + data["5C"]["home"] + "</td>";
                                    html += "<td" + highlight + ">" + data["HK-CH"]["home"] + "</td>";
                                    highlight = "";
                                    if (string_overlap(data["HK-EN"]["home"], data["BF"]["home"])) {
                                        exclamation += "!";
                                        highlight = " class='text-danger'";
                                    }
                                    html += "<td" + highlight + ">" + data["HK-EN"]["home"] + "</td>";
                                    html += "<td" + highlight + ">" + data["BF"]["home"] + "</td>";
                                    highlight = "";
                                    if (string_overlap(data["5C"]["away"], data["HK-CH"]["away"])) {
                                        exclamation += "!";
                                        highlight = " class='text-danger'";
                                    }
                                    html += "<td" + highlight + ">" + data["5C"]["away"] + "</td>";
                                    html += "<td" + highlight + ">" + data["HK-CH"]["away"] + "</td>";
                                    highlight = "";
                                    if (string_overlap(data["HK-EN"]["away"], data["BF"]["away"])) {
                                        exclamation += "!";
                                        highlight = " class='text-danger'";
                                    }
                                    html += "<td" + highlight + ">" + data["HK-EN"]["away"] + "</td>";
                                    html += "<td" + highlight + ">" + data["BF"]["away"] + "</td>";
                                    html += "<td>";
                                    html += "<button class='btn btn-xs btn-default' onclick=\"alias_add('" + data["5C"]["home"] + "','" + data["HK-CH"]["home"] + "','" + data["HK-EN"]["home"] + "','" + data["BF"]["home"] + "','" + data["5C"]["away"] + "','" + data["HK-CH"]["away"] + "','" + data["HK-EN"]["away"] + "','" + data["BF"]["away"] + "');\">Confirm Match</button> ";
                                    // html += "<button class='btn btn-xs btn-default' onclick=\"alias_add('" + data["5C"]["home"] + "','" + data["HK-CH"]["home"] + "',null,null,'" + data["5C"]["away"] + "','" + data["HK-CH"]["away"] + "',null,null);\">Confirm Chinese Match</button>";
                                    // html += "<button class='btn btn-xs btn-default' onclick=\"alias_add(null,null,'" + data["HK-EN"]["home"] + "','" + data["BF"]["home"] + "',null,null,'" + data["HK-EN"]["away"] + "','" + data["BF"]["away"] + "');\">Confirm English Match</button> ";
                                    html += "</td>";
                                    html += "</tr>";
                                    $("#alias-list tbody").append("<tr><td><span class='label label-primary'>" + exclamation + "</span></td>" + html);
                                }
                            }
                        }
                    }
                }
            }
            $("#alias-list").DataTable({
                order: [[0, "desc"]]
            });
            bootbox.hideAll();
        }, 5000);
    }
}

function alias_add(home_zh_cn, home_zh_tw, home_en_hk, home_en_gb, away_zh_cn, away_zh_tw, away_en_hk, away_en_gb) {
    bootbox.confirm("<p>The following aliases will be created:</p><pre>" + home_zh_cn + " = " + home_zh_tw + " = " + home_en_hk + " = " + home_en_gb + "<br/>" + away_zh_cn + " = " + away_zh_tw + " = " + away_en_hk + " = " + away_en_gb + "</pre>", function (resp) {
        if (resp) {
            $.get("/api/lottery/alias/add/?zh_cn=" + home_zh_cn + "&zh_tw=" + home_zh_tw + "&en_hk=" + home_en_hk + "&en_gb=" + home_en_gb, function (resp) {
                bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + resp["zh_cn"] + " = " + resp["zh_tw"] + " = " + resp["en_hk"] + " = " + resp["en_gb"] + "</pre>");
            }).fail(function (resp) {
                bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + home_zh_cn + " = " + home_zh_tw + " = " + home_en_hk + " = " + home_en_gb + "</pre>");
            });
            $.get("/api/lottery/alias/add/?zh_cn=" + away_zh_cn + "&zh_tw=" + away_zh_tw + "&en_hk=" + away_en_hk + "&en_gb=" + away_en_gb, function (resp) {
                bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + resp["zh_cn"] + " = " + resp["zh_tw"] + " = " + resp["en_hk"] + " = " + resp["en_gb"] + "</pre>");
            }).fail(function (resp) {
                bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + away_zh_cn + " = " + away_zh_tw + " = " + away_en_hk + " = " + away_en_gb + "</pre>");
            });
        }
    });
}

