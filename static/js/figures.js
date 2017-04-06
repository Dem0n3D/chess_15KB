import $ from 'jquery';

export const FIGURE_SELECT = "FIGURE_SELECT";
export const SET_BOARD_STATE= "SET_BOARD_STATE";

export function select(id) {
    return {
        type: FIGURE_SELECT,
        id
    }
}

function set_board_state(board, moves) {
    return {
        type: SET_BOARD_STATE,
        board: board,
        moves: moves
    };
}

export function move(board_id, from, to) {
    return (dispatch, getState) => {
        $.post(`/board/${board_id}/${from}/${to}`).done((resp) => {
            dispatch(set_board_state(resp.board, resp.moves));
        });
    }
}

export function load(board_id) {
    return (dispatch, getState) => {
        $.get(`/board/${board_id}/figures`).done((resp) => {
            dispatch(set_board_state(resp.board, resp.moves));
        });
    }
}

const initialState = {board: undefined, moves: [], selected: undefined};

export function figuresReducer(state=initialState, action) {
    switch (action.type) {
        case FIGURE_SELECT: {
            return {
                ...state,
                selected: action.id
            }
        }

        case SET_BOARD_STATE: {
            return {
                ...state,
                board: action.board,
                moves: action.moves,
                selected: undefined
            }
        }

        default: {
            return state;
        }
    }
}