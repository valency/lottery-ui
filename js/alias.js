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
        message: loading_message("Loading..."),
        closeButton: false
    });
    load_alias(function () {
        STATE["5C"] = false;
        $.get("/api/lottery/market/query/?src=5C", function (resp) {
            STATE["5C"] = true;
            DATA["5C"] = resp;
            analyze();
        });
        STATE["HK-CH"] = false;
        $.get("/api/lottery/market/query/?src=HK-CH", function (resp) {
            STATE["HK-CH"] = true;
            DATA["HK-CH"] = resp;
            analyze();
        });
        STATE["HK-EN"] = false;
        $.get("/api/lottery/market/query/?src=HK-EN", function (resp) {
            STATE["HK-EN"] = true;
            DATA["HK-EN"] = resp;
            analyze();
        });
        STATE["BF"] = false;
        $.get("/api/lottery/market/query/?src=BF", function (resp) {
            STATE["BF"] = true;
            DATA["BF"] = resp;
            analyze();
        });
    });
});

function analyze() {
    if (STATE["5C"] && STATE["HK-EN"] && STATE["HK-CH"] && STATE["BF"]) {
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
                                if (string_overlap(data["HK-EN"]["away"], data["BF"]["away"])) {
                                    exclamation += "!";
                                    highlight = " class='text-danger'";
                                }
                                html += "<td" + highlight + ">" + data["HK-EN"]["away"] + "</td>";
                                html += "<td" + highlight + ">" + data["BF"]["away"] + "</td>";
                                html += "<td><button class='btn btn-xs btn-default' onclick='alias_add(" + i + "," + j + ");'>Confirm Match</button></td>";
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
    }
}

function alias_add(a, b) {
    bootbox.confirm("<p>The following aliases will be created:</p><pre>" + DATA["5C"][a]["home"] + " = " + DATA["HK-CH"][b]["home"] + "<br/>" + DATA["5C"][a]["away"] + " = " + DATA["HK-CH"][b]["away"] + "</pre>", function (resp) {
        if (resp) {
            if (DATA["5C"][a]["home"] != DATA["HK-CH"][b]["home"]) {
                $.get("/api/lottery/crawl/alias/add?a=" + DATA["5C"][a]["home"] + "&b=" + DATA["HK-CH"][b]["home"], function (resp) {
                    bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + DATA["5C"][a]["home"] + " = " + DATA["HK-CH"][b]["home"] + "</pre>");
                }).fail(function (resp) {
                    bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + DATA["5C"][a]["home"] + " = " + DATA["HK-CH"][b]["home"] + "</pre>");
                });
            }
            if (DATA["5C"][a]["away"] != DATA["HK-CH"][b]["away"]) {
                $.get("/api/lottery/crawl/alias/add?a=" + DATA["5C"][a]["away"] + "&b=" + DATA["HK-CH"][b]["away"], function (resp) {
                    bootbox.alert("<p>" + success_message("Successfully created the following alias:") + "</p><pre>" + DATA["5C"][a]["away"] + " = " + DATA["HK-CH"][b]["away"] + "</pre>");
                }).fail(function (resp) {
                    bootbox.alert("<p>" + error_message("Failed to create the following alias:") + "</p><pre>" + DATA["5C"][a]["away"] + " = " + DATA["HK-CH"][b]["away"] + "</pre>");
                });
            }
        }
    });
}

