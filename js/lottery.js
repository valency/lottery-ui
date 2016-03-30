var ALIAS = [];

function load_alias(callback) {
    $.get("/api/lottery/alias/list/", function (resp) {
        ALIAS = resp;
        callback();
    });
}

function check_alias(zh_cn, zh_tw, en_gb) {
    if (zh_cn == zh_tw) return true;
    for (var i = 0; i < ALIAS.length; i++) {
        if (ALIAS["zh_cn"] == zh_cn && ALIAS["zh_tw"] == zh_tw) {
            if (en_gb != undefined && en_gb != null) {
                return ALIAS["en_gb"] == en_gb;
            } else {
                return true;
            }
        }
    }
    return false;
}
