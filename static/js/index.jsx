import $ from 'jquery';

import '../css/chess.css';

import _ from 'underscore';
import classNames from 'classnames';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import {select, move, load, figuresReducer} from './figures';

export const Figure = ({color, text}) => <div className={`figure ${color}`}>{text}</div>;

const ConnectColoredFigure = (ComposedComponent, color) => (
    (props) => (
        <ComposedComponent {...props} color={color} />
    )
);

export const BlackFigure = ConnectColoredFigure(Figure, "black");
export const WhiteFigure = ConnectColoredFigure(Figure, "white");

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
                onMove(selected, id);
            }
        }}
    >
        {children}
    </div>
);

export class Board extends React.Component {

    componentDidMount() {
        this.props.load();
    }

    render() {
        const {board, moves, selected, onSelect, onMove} = this.props;
        
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
                                            selected={selected}
                                            moves={moves}
                                            onSelect={onSelect}
                                            onMove={onMove}
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

const mapStateToProps = (state, props) => {
    return {
        board: state.figures.board,
        moves: state.figures.moves,
        selected: state.figures.selected
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSelect: (figure_id) => dispatch(select(figure_id)),
        onMove: (from, to) => dispatch(move(props.id, from, to)),
        load: () => dispatch(load(props.id))
    }
};

const BoardContainer = connect(mapStateToProps, mapDispatchToProps)(Board);

const reducer = combineReducers({
    figures: figuresReducer
});
const store = createStore(reducer, applyMiddleware(thunkMiddleware));

$(function() {
    ReactDOM.render(
        <Provider store={store}>
            <BoardContainer id={$("meta[name='game_id']").data("id")} />
        </Provider>,
        $("#board")[0]
    );
});
