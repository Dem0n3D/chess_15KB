import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {load, move, select, set_board_state, FIGURE_SELECT, SET_BOARD_STATE} from '../figures'
import nock from 'nock'

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
    afterEach(() => {
        nock.cleanAll()
    });

    it('fetches board', () => {
        const resp = {
            "board": [[{"color": "black", "text": "\u265c"}, {
                "color": "black",
                "text": "\u265e"
            }, {"color": "black", "text": "\u265d"}, {"color": "black", "text": "\u265b"}, {
                "color": "black",
                "text": "\u265a"
            }, {"color": "black", "text": "\u265d"}, {"color": "black", "text": "\u265e"}, {
                "color": "black",
                "text": "\u265c"
            }], [{"color": "black", "text": "\u265f"}, {"color": "black", "text": "\u265f"}, {
                "color": "black",
                "text": "\u265f"
            }, {"color": "black", "text": "\u265f"}, {"color": "black", "text": "\u265f"}, null, {
                "color": "black",
                "text": "\u265f"
            }, {
                "color": "black",
                "text": "\u265f"
            }], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, {
                "color": "white",
                "text": "\u265f"
            }, null], [null, null, null, null, null, null, null, null], [null, null, null, null, {
                "color": "black",
                "text": "\u265f"
            }, null, null, null], [{"color": "white", "text": "\u265f"}, {
                "color": "white",
                "text": "\u265f"
            }, {"color": "white", "text": "\u265f"}, {"color": "white", "text": "\u265f"}, null, {
                "color": "white",
                "text": "\u265f"
            }, null, {"color": "white", "text": "\u265f"}], [{"color": "white", "text": "\u265c"}, {
                "color": "white",
                "text": "\u265e"
            }, {"color": "white", "text": "\u265d"}, {"color": "white", "text": "\u265b"}, {
                "color": "white",
                "text": "\u265a"
            }, {"color": "white", "text": "\u265d"}, {"color": "white", "text": "\u265e"}, {
                "color": "white",
                "text": "\u265c"
            }]],
            "moves": [["g1", "h3"], ["g1", "f3"], ["g1", "e2"], ["f1", "a6"], ["f1", "b5"], ["f1", "c4"], ["f1", "h3"], ["f1", "d3"], ["f1", "g2"], ["f1", "e2"], ["e1", "e2"], ["d1", "h5"], ["d1", "g4"], ["d1", "f3"], ["d1", "e2"], ["b1", "c3"], ["b1", "a3"], ["f2", "e3"], ["d2", "e3"], ["g5", "g6"], ["h2", "h3"], ["f2", "f3"], ["d2", "d3"], ["c2", "c3"], ["b2", "b3"], ["a2", "a3"], ["h2", "h4"], ["f2", "f4"], ["d2", "d4"], ["c2", "c4"], ["b2", "b4"], ["a2", "a4"]]
        };

        nock('http://127.0.0.1:5000/')
            .get('/board/1/figures')
            .reply(200, resp);

        const expectedActions = [
            {type: SET_BOARD_STATE, board: resp.board, moves: resp.moves,}
        ];
        const store = mockStore({board: undefined, moves: [], selected: undefined})

        store.subscribe(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });

        store.dispatch(load(1));
    })
});
