from sqlalchemy import *
from sqlalchemy.orm import relationship, backref

from alchemy import db

import chess


class Turn(db.Model):

    id = Column(Integer, primary_key=True)

    src = Column(CHAR(2), nullable=False)
    dst = Column(CHAR(2), nullable=False)

    game_id = Column(Integer, ForeignKey("game.id"), nullable=False)
    game = relationship("Game", backref=backref("turns", order_by=id))

    def uci(self):
        return self.src + self.dst


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

    fen = Column(String(1000), nullable=False, default="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

    def move(self, start, end):
        turn = Turn(src=start, dst=end, game=self)
        db.session.add(turn)

        move = chess.Move.from_uci(turn.uci())
        board = chess.Board(self.fen)

        if(move not in board.legal_moves):
            raise Exception("Неправильный ход!")

        board.push(move)

        self.fen = board.fen()

        db.session.commit()

    def board(self):
        board = chess.Board(self.fen)

        return [[{
              "text": {
                  "r": "♜",
                  "n": "♞",
                  "b": "♝",
                  "k": "♚",
                  "q": "♛",
                  "p": "♟",
              }[c.lower()],
              "color": "white" if c.isupper() else "black",
          } if c != "." else None for c in r.split(' ')] for r in str(board).split('\n')]
