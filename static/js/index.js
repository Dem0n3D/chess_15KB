import $ from 'jquery';

import '../css/chess.css';

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

    $.get(`/board/${$("meta[name='game_id']").data("id")}/figures`).done((resp) => {
        console.log(resp)
    });

});
