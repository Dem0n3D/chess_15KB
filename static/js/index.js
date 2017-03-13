import $ from 'jquery';

import '../css/chess.css';

$(function() {

    var selected = null;

    $.get(`/board/${$("meta[name='game_id']").data("id")}/figures`).done((resp) => {
        var table = $("<table>");
        var tbody = $("<tbody>");
        for(var i = 0; i < 8; i++) {
            var tr = $("<tr>");
            for(var j = 0; j < 8; j++) {
                var td = $("<td>");
                let div = $("<div>");

                div.attr("id", `${"abcdefgh"[j]}${8-i}`);
                div.addClass("cell");

                if(resp.board[i][j]) {
                    div.addClass("figure");
                    div.addClass(resp.board[i][j].color);
                    div.text(resp.board[i][j].text);
                }

                td.html(div);
                tr.append(td);
            }
            tbody.append(tr);
        }
        table.html(tbody);

        $("body").html(table);

        $("div.figure").click(e => {
            if(resp.moves.map(pair => pair[0]).includes($(e.target).attr("id"))) {
                $("div.selected").removeClass("selected");
                $("div.cell").removeClass("legal");

                $(e.target).addClass("selected");
                resp.moves
                    .filter(pair => pair[0] == $(e.target).attr("id"))
                    .forEach(pair => $(`#${pair[1]}`).addClass("legal"));
            }
        });

        table.on("click", "div.legal", e => {

        });
    });

});
