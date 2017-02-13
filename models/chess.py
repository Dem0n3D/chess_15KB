from sqlalchemy import *

from alchemy import db


class Turn(db.Model):

    id = Column(Integer, primary_key=True)

    src = Column(CHAR(2), nullable=False)
    dst = Column(CHAR(2), nullable=False)

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
