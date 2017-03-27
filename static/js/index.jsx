import $ from 'jquery';

import '../css/chess.css';

import Backbone from 'backbone';

import React from 'react';
import ReactDOM from 'react-dom';

const Game = Backbone.Model.extend({

    defaults: {
        "board": [],
        "moves": [],
        "selected": undefined
    }

});

const Figure = ({color, text}) => <div className={`figure ${color}`}>{text}</div>;

const ConnectColoredFigure = (ComposedComponent, color) => (
    (props) => (
        <ComposedComponent {...props} color={color} />
    )
);

const BlackFigure = ConnectColoredFigure(Figure, "black");
const WhiteFigure = ConnectColoredFigure(Figure, "white");

$(function() {

    var selected = null;

    const game = new Game();

    game.bind("change", () => {
        var table = $("<table>");
        var tbody = $("<tbody>");
        for(var i = 0; i < 8; i++) {
            var tr = $("<tr>");
            for(var j = 0; j < 8; j++) {
                var td = $("<td>");
                let div = $("<div>");
                const id = `${"abcdefgh"[j]}${8-i}`;

                div.attr("id", id);
                div.addClass("cell");

                if(game.get("board")[i][j]) {
                    ReactDOM.render(
                        game.get("board")[i][j].color == "black"
                            ? <BlackFigure text={game.get("board")[i][j].text} />
                            : <WhiteFigure text={game.get("board")[i][j].text} />,
                        div[0]
                    );

                    if(game.get("moves").map(pair => pair[0]).includes(id)) {
                        div.addClass("can_move");

                        div.click(e => {
                            game.set("selected", id);
                        });
                    }

                    if(game.get("selected") && game.get("selected") == id) {
                        div.addClass("selected");
                    }
                }

                if(game.get("selected") && game.get("moves").filter(pair => pair[0] == game.get("selected")).map(pair => pair[1]).includes(id)) {
                    div.addClass("legal");

                    div.click(e => {
                        $.post(`/board/${$("meta[name='game_id']").data("id")}/${game.get("selected")}/${id}`).done(resp => {
                            game.set({board: resp.board, moves: resp.moves, selected: undefined});
                        });
                    });
                }

                td.html(div);
                tr.append(td);
            }
            tbody.append(tr);
        }
        table.html(tbody);

        $("body").html(table);
    });

    $.get(`/board/${$("meta[name='game_id']").data("id")}/figures`).done((resp) => {
        game.set({board: resp.board, moves: resp.moves, selected: undefined});
    });

});
