$(document).ready(function () {
    $.get("/api/lottery/crawl/list/500", function (resp) {
        for (var i = 0; i < resp.length; i++) {
            var html = "<tr>";
            html += "<td>" + resp[i]["id"] + "</td>";
            html += "<td>" + resp[i]["home"] + "</td>";
            html += "<td>" + resp[i]["away"] + "</td>";
            html += "<td>" + resp[i]["t"] + "</td>";
            html += "<td>" + resp[i]["odds"]["home"] + "</td>";
            html += "<td>" + resp[i]["odds"]["draw"] + "</td>";
            html += "<td>" + resp[i]["odds"]["away"] + "</td>";
            html += "</tr>";
            $("#table_500 tbody").append(html);
        }
        $('#table_500').DataTable();
    });
    $.get("/api/lottery/crawl/list/macau", function (resp) {
        for (var i = 0; i < resp.length; i++) {
            for (var j = 0; j < resp[i]["odds"].length; j++) {
                var html = "<tr>";
                html += "<td>" + resp[i]["id"] + "</td>";
                html += "<td>" + resp[i]["home"] + "</td>";
                html += "<td>" + resp[i]["away"] + "</td>";
                html += "<td>" + resp[i]["t"] + "</td>";
                html += "<td>" + resp[i]["odds"][j]["team"] + " " + macau_market(parseInt(resp[i]["odds"][j]["mode"])) + "</td>";
                html += "<td>" + resp[i]["odds"][j]["home"] + "</td>";
                html += "<td>" + resp[i]["odds"][j]["away"] + "</td>";
                html += "</tr>";
                $("#table_macau tbody").append(html);
            }
        }
        $('#table_macau').DataTable();
    })
});

function macau_market(mode) {
    var base = Math.floor(mode / 2) * 0.5;
    if (mode % 2 == 0) {
        return (base - 0.5).toString() + "/" + base.toString();
    } else {
        return base;
    }
}