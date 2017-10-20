# -*- coding: utf_8 -*-

import json
import os
import unittest

import chess
from flask import Flask
from sqlalchemy import func

from alchemy import db
from flask_chess import board, board1, bp
from models.chess import Game


class TestChess(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__, template_folder="../templates")
        self.app.config["DEBUG"] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB', 'postgresql://chess:qwerty@localhost:15435/chess')
        self.app.config['SQLALCHEMY_ECHO'] = True
        self.app.register_blueprint(bp)

        db.init_app(self.app)

        self.app.testing = True
        self.app.app_context().push()

        self.client = self.app.test_client()

        db.session.begin_nested()

    def tearDown(self):
        db.session.rollback()

    def test_board(self):
        id = db.session.query(func.max(Game.id))[0][0] + 1
        r1 = self.client.get("/board/"+str(id))
        r2 = self.client.get("/board/"+str(id))
        self.assertEquals(r1.data.decode("utf-8"), r2.data.decode("utf-8"))

    def test_board1(self):
        id = db.session.query(func.max(Game.id))[0][0] + 1
        self.client.get("/board/"+str(id))
        r = self.client.get("/board/{}/figures".format(id))
        self.assertEquals(r.status_code, 200)

        moves = [[m.uci()[0:2], m.uci()[2:]] for m in chess.Board().legal_moves]
        data = json.loads(r.data.decode("utf-8"))

        game = db.session.query(Game).get(id)

        self.assertEquals(data["moves"], moves)
        self.assertEquals(data["board"], game.board())

    def test_turn(self):
        id = db.session.query(func.max(Game.id))[0][0] + 1
        self.client.get("/board/"+str(id))
        r = self.client.post("/board/{}/{}/{}".format(id, "e2", "e4"), follow_redirects=True)
        self.assertEquals(r.status_code, 200)

        board = chess.Board()
        board.push(chess.Move.from_uci("e2e4"))
        moves = [[m.uci()[0:2], m.uci()[2:]] for m in board.legal_moves]
        data = json.loads(r.data.decode("utf-8"))

        game = db.session.query(Game).get(id)

        self.assertEquals(data["moves"], moves)
        self.assertEquals(data["board"], game.board())
