var ALIAS = null;

function load_alias(callback) {
    $.get("/api/lottery/crawl/alias/list", function (resp) {
        ALIAS = [];
        for (var i = 0; i < resp.length; i++) {
            ALIAS[i] = [resp[i]["a"], resp[i]["b"]];
        }
        callback();
    });
}

function check_alias(a, b) {
    if (a == b) return true;
    for (var i = 0; i < ALIAS.length; i++) {
        if (contains(ALIAS[i], a) && contains(ALIAS[i], b)) return true;
    }
    return false;
}