$(document).ready(function () {
    bootbox.dialog({
        message: loading_message("Loading... <span class='label label-default pull-right' id='loading-5c'>5C</span> <span class='label label-default pull-right' id='loading-hk-ch'>HK-CH</span> <span class='label label-default pull-right' id='loading-hk-en'>HK-EN</span> <span class='label label-default pull-right' id='loading-bf'>BF</span>"),
        closeButton: false
    });
    load_alias(function () {
        load_markets(analyze);
    });
});

function analyze() {
    if (MARKETS["5C"] != null && MARKETS["HK-EN"] != null && MARKETS["HK-CH"] != null && MARKETS["BF"] != null) {
        bootbox.hideAll();
        bootbox.dialog({
            message: loading_message("Analyzing aliases..."),
            closeButton: false
        });
        for (var i = 0; i < MARKETS["5C"]["markets"].length; i++) {
            // 5C
            var data = {
                "5C": MARKETS["5C"]["markets"][i],
                "HK-CH": null,
                "HK-EN": null,
                "BF": null
            };
            for (var j = 0; j < MARKETS["HK-CH"]["markets"].length; j++) {
                // HK-CH & HK-EN
                if (data["5C"]["t"] == MARKETS["HK-CH"]["markets"][j]["t"]) {
                    for (var k = 0; k < MARKETS["HK-EN"]["markets"].length; k++) {
                        if (MARKETS["HK-CH"]["markets"][j]["market"] == MARKETS["HK-EN"]["markets"][k]["market"] && MARKETS["HK-CH"]["markets"][j]["t"] == MARKETS["HK-EN"]["markets"][k]["t"]) {
                            data["HK-CH"] = MARKETS["HK-CH"]["markets"][j];
                            data["HK-EN"] = MARKETS["HK-EN"]["markets"][k];
                            break;
                        }
                    }
                }
                if (data["HK-CH"] != null && data["HK-EN"] != null) {
                    // BF
                    for (k = 0; k < MARKETS["BF"]["markets"].length; k++) {
                        if (data["5C"]["t"] == MARKETS["BF"]["markets"][k]["t"]) {
                            data["BF"] = MARKETS["BF"]["markets"][k];
                            // Write out (only if not already matched in aliases)
                            if (!(check_alias([data["5C"]["home"], data["HK-CH"]["home"], data["HK-EN"]["home"], data["BF"]["home"]]) && check_alias([data["5C"]["away"], data["HK-CH"]["away"], data["HK-EN"]["away"], data["BF"]["away"]]))) {
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
                                html += "<td><button class='btn btn-xs btn-default' onclick=\"alias_add('" + data["5C"]["home"] + "','" + data["HK-CH"]["home"] + "','" + data["HK-EN"]["home"] + "','" + data["BF"]["home"] + "','" + data["5C"]["away"] + "','" + data["HK-CH"]["away"] + "','" + data["HK-EN"]["away"] + "','" + data["BF"]["away"] + "');\">Confirm Match</button></td>";
                                $("#alias-list tbody").append("<tr><td><span class='label label-primary'>" + exclamation + "</span></td>" + html + "</tr>");
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        $("#alias-list").DataTable({
            order: [[0, "desc"]]
        });
        bootbox.hideAll();
    }
}

function alias_add(home_5c, home_hk_ch, home_hk_en, home_bf, away_5c, away_hk_ch, away_hk_en, away_bf) {
    bootbox.confirm("<p>The following aliases will be created:</p><pre>" + home_5c + " = " + home_hk_ch + " = " + home_hk_en + " = " + home_bf + "<br/>" + away_5c + " = " + away_hk_ch + " = " + away_hk_en + " = " + away_bf + "</pre>", function (resp) {
        if (resp) {
            $.get("/api/lottery/alias/add/?s=" + home_5c + "," + home_hk_ch + "," + home_hk_en + "," + home_bf, function (resp) {
                alias_result(resp)
            }).fail(function (resp) {
                bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + home_5c + " = " + home_hk_ch + " = " + home_hk_en + " = " + home_bf + "</pre>");
            });
            $.get("/api/lottery/alias/add/?s=" + away_5c + "," + away_hk_ch + "," + away_hk_en + "," + away_bf, function (resp) {
                alias_result(resp)
            }).fail(function (resp) {
                bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + away_5c + " = " + away_hk_ch + " = " + away_hk_en + " = " + away_bf + "</pre>");
            });
        }
    });
}

function alias_result(resp) {
    var html = "<p>" + success_message("Successfully created the following alias:") + "</p><pre>";
    for (var i = 0; i < resp["list"].length; i++) {
        if (i > 0) html += " = ";
        html += resp["list"][i];
    }
    bootbox.alert(html + "</pre>");
}

