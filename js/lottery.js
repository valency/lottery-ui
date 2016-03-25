var ALIAS = null;

function load_alias(callback) {
    $.get("/api/lottery/crawl/alias/list", function (resp) {
        ALIAS = resp;
        callback();
    });
}

function check_alias(a, b) {
    if (a == b) return true;
    for (var i = 0; i < ALIAS.length; i++) {
        if ((a == ALIAS[i]["a"] && b == ALIAS[i]["b"]) || (a == ALIAS[i]["b"] && b == ALIAS[i]["a"])) return true;
    }
    return false;
}