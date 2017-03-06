$(function() {

    var table = $("<table>");
    var tbody = $("<tbody>");
    for(var i = 0; i < 8; i++) {
        var tr = $("<tr>");
        for(var j = 0; j < 8; j++) {
            var td = $("<td>");
            tr.append(td);
        }
        tbody.append(tr);
    }
    table.html(tbody);

    $("body").html(table);

});
