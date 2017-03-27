import $ from 'jquery';

import '../css/chess.css';

import _ from 'underscore';
import classNames from 'classnames';

import React from 'react';
import ReactDOM from 'react-dom';

const Figure = ({color, text}) => <div className={`figure ${color}`}>{text}</div>;

const ConnectColoredFigure = (ComposedComponent, color) => (
    (props) => (
        <ComposedComponent {...props} color={color} />
    )
);

const BlackFigure = ConnectColoredFigure(Figure, "black");
const WhiteFigure = ConnectColoredFigure(Figure, "white");

const Cell = ({id, moves, selected, children, onSelect, onMove}) => (
    <div
        id={id}
        className={classNames({
            cell: true,
            can_move: moves && moves.map(pair => pair[0]).includes(id),
            selected: selected && selected == id,
            legal: selected && moves && moves.filter(pair => pair[0] == selected).map(pair => pair[1]).includes(id)
        })}
        onClick={e => {
            if(moves && moves.map(pair => pair[0]).includes(id)) {
                onSelect(id);
            }

            if(selected && moves && moves.filter(pair => pair[0] == selected).map(pair => pair[1]).includes(id)) {
                $.post(`/board/${$("meta[name='game_id']").data("id")}/${selected}/${id}`).done(resp => {
                    onMove(resp);
                });
            }
        }}
    >
        {children}
    </div>
);

class Board extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            board: undefined,
            moves: undefined,
            selected: undefined
        };
    }

    componentDidMount() {
        $.get(`/board/${$("meta[name='game_id']").data("id")}/figures`).done((resp) => {
            this.setState({
                board: resp.board,
                moves: resp.moves,
                selected: undefined
            });
        });
    }

    render() {
        const {board} = this.state;
        
        return (
            <table>
                <tbody>
                    {_.range(8).map(row => (
                        <tr key={row}>
                            {_.range(8).map(col => {
                                const id = `${"abcdefgh"[col]}${8-row}`;

                                return  (
                                    <td key={col}>
                                        <Cell
                                            id={id}
                                            selected={this.state.selected}
                                            moves={this.state.moves}
                                            onSelect={id => this.setState({selected: id})}
                                            onMove={resp => this.setState({
                                                board: resp.board,
                                                moves: resp.moves,
                                                selected: undefined
                                            })}
                                        >
                                            {board && board[row][col] ? (
                                                board[row][col].color == "black"
                                                    ? <BlackFigure text={board[row][col].text} />
                                                    : <WhiteFigure text={board[row][col].text} />
                                            ) : null}
                                        </Cell>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

}

$(function() {
    ReactDOM.render(
        <Board/>,
        $("#board")[0]
    );
});
