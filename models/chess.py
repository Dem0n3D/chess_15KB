from sqlalchemy import *
from sqlalchemy.orm import relationship, backref

from alchemy import db


class Turn(db.Model):

    id = Column(Integer, primary_key=True)

    src = Column(CHAR(2), nullable=False)
    dst = Column(CHAR(2), nullable=False)

    game_id = Column(Integer, ForeignKey("game.id"), nullable=False)
    game = relationship("Game", backref=backref("turns", order_by=id))


class Figure(db.Model):
    id = Column(Integer, primary_key=True)

    symbol = Column(String, nullable=False)

    is_white = Column(Boolean, nullable=False)

    row = Column(SmallInteger)
    column = Column(SmallInteger)

    @property
    def name(self):
        return {
            "♜": "rook",
            "♞": "knight",
            "♝": "bishop",
            "♚": "king",
            "♛": "queen",
            "♟": "pawn"
        }[self.symbol]


class Game(db.Model):

    id = Column(Integer, primary_key=True)

    def move(self, start, end):
        turn = Turn(src=start, dst=end, game=self)
        db.session.add(turn)
        db.session.commit()

    def board(self):
        colors = ['black', 'white']
        rows = [0, 7]

        figures = []

        for c in range(2):
            for i in range(8):
                figures.append(
                    {"name": 'pawn', "text": '♟' if c == 1 else '♙', "color": colors[c], "row": 1 if c == 0 else 6,
                     "col": i})

                figures += [
                    {"name": 'rook', "text": '♜' if c == 1 else '♖', "color": colors[c], "row": rows[c], "col": 0},
                    {"name": 'knight', "text": '♞' if c == 1 else '♘', "color": colors[c], "row": rows[c], "col": 1},
                    {"name": 'bishop', "text": '♝' if c == 1 else '♗', "color": colors[c], "row": rows[c], "col": 2},
                    {"name": 'rook', "text": '♜' if c == 1 else '♖', "color": colors[c], "row": rows[c], "col": 7},
                    {"name": 'knight', "text": '♞' if c == 1 else '♘', "color": colors[c], "row": rows[c], "col": 6},
                    {"name": 'bishop', "text": '♝' if c == 1 else '♗', "color": colors[c], "row": rows[c], "col": 5},
                    {"name": 'king', "text": '♚' if c == 1 else '♔', "color": colors[c], "row": rows[c], "col": 4},
                    {"name": 'queen', "text": '♛' if c == 1 else '♕', "color": colors[c], "row": rows[c], "col": 3},
                ]

        def find_figure(i, j):
            try:
                return [f for f in figures if f["row"] == i and f["col"] == j][0]
            except IndexError:
                return None

        board = [[find_figure(i, j) for j in range(8)] for i in range(8)]

        for turn in self.turns:
            board[int(turn.dst[0])][int(turn.dst[1])] = board[int(turn.src[0])][int(turn.src[1])]
            board[int(turn.src[0])][int(turn.src[1])] = None

        return board
